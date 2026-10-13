import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomUUID } from 'crypto';
import { In, Repository } from 'typeorm';
import { NeonS3StorageAdapter } from '../storage/neon-s3.storage';
import { ActivityService } from '../activity/activity.service';
import { FileObject } from './file-object.entity';
import { FileKeyMaterial } from './file-key-material.entity';

export type UploadMeta = {
  originalName: string;
  mimeType: string;
  wrappedAesKey: string;
  iv: string;
  authTag: string;
};

@Injectable()
export class FilesService {
  private readonly maxUploadBytes: number;

  constructor(
    @InjectRepository(FileObject)
    private readonly filesRepo: Repository<FileObject>,
    @InjectRepository(FileKeyMaterial)
    private readonly keysRepo: Repository<FileKeyMaterial>,
    private readonly storage: NeonS3StorageAdapter,
    private readonly activityService: ActivityService,
    config: ConfigService,
  ) {
    this.maxUploadBytes = Number(
      config.get<string>('MAX_UPLOAD_BYTES') ?? 52_428_800,
    );
  }

  async listForUser(userId: string) {
    const files = await this.filesRepo.find({
      where: { ownerId: userId },
      order: { uploadedAt: 'DESC' },
    });
    return files.map((f) => this.toMetadata(f));
  }

  async getMetadata(userId: string, fileId: string) {
    const file = await this.findOwned(userId, fileId);
    const material = await this.keysRepo.findOne({ where: { fileId } });
    if (!material) {
      throw new NotFoundException('Key material missing');
    }
    return {
      ...this.toMetadata(file),
      wrappedAesKey: material.wrappedAesKey.toString('base64'),
      iv: material.iv.toString('base64'),
      authTag: material.authTag.toString('base64'),
      ciphertextHash: material.ciphertextHash.toString('base64'),
    };
  }

  async upload(userId: string, ciphertext: Buffer, meta: UploadMeta) {
    if (ciphertext.byteLength > this.maxUploadBytes) {
      throw new PayloadTooLargeException(
        `File exceeds max upload size of ${this.maxUploadBytes} bytes`,
      );
    }

    const fileId = randomUUID();
    const storageKey = `vaultspace/${userId}/${fileId}`;
    const ciphertextHash = createHash('sha256').update(ciphertext).digest();

    const stored = await this.storage.upload(
      storageKey,
      ciphertext,
      'application/octet-stream',
    );

    const file = this.filesRepo.create({
      id: fileId,
      ownerId: userId,
      originalName: meta.originalName,
      mimeType: meta.mimeType || 'application/octet-stream',
      sizeBytes: String(stored.sizeBytes),
      storageBucket: stored.bucket,
      storageKey: stored.key,
      encryptionAlgo: 'AES-256-GCM',
      wrappingAlgo: 'RSA-OAEP-SHA256',
      encryptionState: 'encrypted',
      keyProtectionState: 'wrapped',
      integrityVerified: null,
    });

    await this.filesRepo.save(file);

    const material = this.keysRepo.create({
      fileId,
      wrappedAesKey: Buffer.from(meta.wrappedAesKey, 'base64'),
      iv: Buffer.from(meta.iv, 'base64'),
      authTag: Buffer.from(meta.authTag, 'base64'),
      ciphertextHash,
    });
    await this.keysRepo.save(material);

    this.activityService.log(
      userId,
      'upload',
      'Encrypted and uploaded',
      meta.originalName,
    );

    return this.getMetadata(userId, fileId);
  }

  async getContent(userId: string, fileId: string) {
    const file = await this.findOwned(userId, fileId);
    const buffer = await this.storage.download(file.storageKey);
    this.activityService.log(
      userId,
      'download',
      'Downloaded and decrypted',
      file.originalName,
    );
    return {
      buffer,
      originalName: file.originalName,
      mimeType: 'application/octet-stream',
    };
  }

  async getSignedUrl(userId: string, fileId: string) {
    const file = await this.findOwned(userId, fileId);
    const url = await this.storage.getSignedDownloadUrl(file.storageKey, 3600);
    return { url, expiresIn: 3600 };
  }

  async remove(userId: string, fileId: string) {
    const file = await this.findOwned(userId, fileId);
    await this.storage.delete(file.storageKey);
    await this.filesRepo.delete({ id: fileId });
    this.activityService.log(
      userId,
      'delete',
      'File deleted',
      file.originalName,
    );
    return { deleted: true };
  }

  async setIntegrity(userId: string, fileId: string, verified: boolean) {
    const file = await this.findOwned(userId, fileId);
    file.integrityVerified = verified;
    await this.filesRepo.save(file);
    return this.toMetadata(file);
  }

  /** Wrapped AES keys for the owner — used when rotating the vault keypair. */
  async listWrappedKeys(userId: string) {
    const files = await this.filesRepo.find({
      where: { ownerId: userId },
      select: { id: true },
    });
    if (files.length === 0) return [];

    const materials = await this.keysRepo.find({
      where: { fileId: In(files.map((f) => f.id)) },
    });

    return materials.map((m) => ({
      fileId: m.fileId,
      wrappedAesKey: this.byteaToBase64(m.wrappedAesKey),
    }));
  }

  async rewrapKeys(
    userId: string,
    updates: { fileId: string; wrappedAesKey: string }[],
  ) {
    for (const item of updates) {
      if (!item?.fileId || !item?.wrappedAesKey) {
        throw new BadRequestException('Invalid rewrap payload');
      }
      await this.findOwned(userId, item.fileId);
      const material = await this.keysRepo.findOne({
        where: { fileId: item.fileId },
      });
      if (!material) {
        throw new NotFoundException(`Key material missing for ${item.fileId}`);
      }
      material.wrappedAesKey = Buffer.from(item.wrappedAesKey, 'base64');
      await this.keysRepo.save(material);
    }

    this.activityService.log(
      userId,
      'key',
      `Re-wrapped ${updates.length} file key${updates.length === 1 ? '' : 's'}`,
    );

    return { updated: updates.length };
  }

  private byteaToBase64(value: Buffer | Uint8Array | string): string {
    if (typeof value === 'string') {
      // pg sometimes returns hex (\x…) or already-base64 depending on driver config
      if (value.startsWith('\\x')) {
        return Buffer.from(value.slice(2), 'hex').toString('base64');
      }
      return value;
    }
    return Buffer.from(value).toString('base64');
  }

  private async findOwned(userId: string, fileId: string) {
    const file = await this.filesRepo.findOne({ where: { id: fileId } });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    if (file.ownerId !== userId) {
      throw new ForbiddenException();
    }
    return file;
  }

  private toMetadata(file: FileObject) {
    return {
      id: file.id,
      originalName: file.originalName,
      mimeType: file.mimeType,
      sizeBytes: Number(file.sizeBytes),
      encryptionAlgo: file.encryptionAlgo,
      wrappingAlgo: file.wrappingAlgo,
      encryptionState: file.encryptionState,
      keyProtectionState: file.keyProtectionState,
      integrityVerified: file.integrityVerified,
      uploadedAt: file.uploadedAt,
    };
  }
}
