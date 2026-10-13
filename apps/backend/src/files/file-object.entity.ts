import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { FileKeyMaterial } from './file-key-material.entity';

@Entity('file_objects')
export class FileObject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'original_name' })
  originalName: string;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ name: 'size_bytes', type: 'bigint' })
  sizeBytes: string;

  @Column({ name: 'storage_bucket' })
  storageBucket: string;

  @Column({ name: 'storage_key' })
  storageKey: string;

  @Column({ name: 'encryption_algo', default: 'AES-256-GCM' })
  encryptionAlgo: string;

  @Column({ name: 'wrapping_algo', default: 'RSA-OAEP-SHA256' })
  wrappingAlgo: string;

  @Column({ name: 'encryption_state', default: 'encrypted' })
  encryptionState: string;

  @Column({ name: 'key_protection_state', default: 'wrapped' })
  keyProtectionState: string;

  @Column({ name: 'integrity_verified', type: 'boolean', nullable: true })
  integrityVerified: boolean | null;

  @CreateDateColumn({ name: 'uploaded_at', type: 'timestamptz' })
  uploadedAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => FileKeyMaterial, (material) => material.file)
  keyMaterial?: FileKeyMaterial;
}
