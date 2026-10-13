import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { StorageAdapter, StoredObject } from './storage.types';

@Injectable()
export class NeonS3StorageAdapter implements StorageAdapter, OnModuleInit {
  private readonly logger = new Logger(NeonS3StorageAdapter.name);
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    const region = this.config.getOrThrow<string>('AWS_REGION');
    const endpoint = this.config.getOrThrow<string>('AWS_ENDPOINT_URL_S3');
    const accessKeyId = this.config.getOrThrow<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.config.getOrThrow<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    this.bucket = this.config.get<string>('NEON_S3_BUCKET') ?? 'assets';

    // Matches Neon snippet: forcePathStyle + AWS_* env credentials
    this.client = new S3Client({
      region,
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });
  }

  async onModuleInit() {
    await this.ensureBucket();
    this.logger.log(`Neon S3 ready (bucket=${this.bucket})`);
  }

  private async ensureBucket() {
    try {
      await this.client.send(
        new HeadBucketCommand({ Bucket: this.bucket }),
      );
    } catch {
      this.logger.warn(`Bucket "${this.bucket}" missing — creating…`);
      await this.client.send(
        new CreateBucketCommand({ Bucket: this.bucket }),
      );
      this.logger.log(`Created bucket "${this.bucket}"`);
    }
  }

  getBucket(): string {
    return this.bucket;
  }

  async upload(
    key: string,
    body: Buffer,
    contentType = 'application/octet-stream',
  ): Promise<StoredObject> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );

    return {
      bucket: this.bucket,
      key,
      sizeBytes: body.byteLength,
    };
  }

  async download(key: string): Promise<Buffer> {
    const result = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    return this.streamToBuffer(result.Body as Readable);
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async getSignedDownloadUrl(
    key: string,
    expiresInSeconds = 3600,
  ): Promise<string> {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
      { expiresIn: expiresInSeconds },
    );
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }
}
