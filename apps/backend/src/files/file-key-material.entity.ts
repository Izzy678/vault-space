import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileObject } from './file-object.entity';

@Entity('file_key_materials')
export class FileKeyMaterial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'file_id', unique: true })
  fileId: string;

  @OneToOne(() => FileObject, (file) => file.keyMaterial, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'file_id' })
  file: FileObject;

  @Column({ name: 'wrapped_aes_key', type: 'bytea' })
  wrappedAesKey: Buffer;

  @Column({ type: 'bytea' })
  iv: Buffer;

  @Column({ name: 'auth_tag', type: 'bytea' })
  authTag: Buffer;

  @Column({ name: 'ciphertext_hash', type: 'bytea' })
  ciphertextHash: Buffer;
}
