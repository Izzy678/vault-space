import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { FileObject } from '../files/file-object.entity';

export type SharePermission = 'view' | 'download';

@Entity('file_shares')
@Index(['fileId', 'recipientUserId'], { unique: true })
@Index(['recipientUserId', 'createdAt'])
@Index(['ownerId', 'createdAt'])
export class FileShare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'file_id' })
  fileId: string;

  @ManyToOne(() => FileObject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'file_id' })
  file: FileObject;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'recipient_user_id' })
  recipientUserId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipient_user_id' })
  recipient: User;

  /** AES file key wrapped to the recipient's RSA public key */
  @Column({ name: 'wrapped_aes_key', type: 'bytea' })
  wrappedAesKey: Buffer;

  @Column({ type: 'varchar', length: 16, default: 'download' })
  permission: SharePermission;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
