export type StoredObject = {
  bucket: string;
  key: string;
  sizeBytes: number;
};

export interface StorageAdapter {
  upload(
    key: string,
    body: Buffer,
    contentType?: string,
  ): Promise<StoredObject>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  getSignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;
}
