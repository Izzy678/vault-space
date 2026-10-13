export type FileRow = {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  integrityVerified: boolean | null;
  wrappedAesKey?: string;
  iv?: string;
  authTag?: string;
};

export type FileCategory =
  | "images"
  | "documents"
  | "videos"
  | "archives"
  | "audio"
  | "other";

export type QueueItem = {
  name: string;
  stage: string;
  error?: string;
};
