import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('vault_key_packages')
export class VaultKeyPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @OneToOne(() => User, (user) => user.vaultKeyPackage, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'public_key_pem', type: 'text' })
  publicKeyPem: string;

  @Column()
  fingerprint: string;

  @Column({ name: 'wrapped_private_key', type: 'bytea' })
  wrappedPrivateKey: Buffer;

  @Column({ name: 'kdf_salt', type: 'bytea' })
  kdfSalt: Buffer;

  @Column({ name: 'kdf_iterations', type: 'int' })
  kdfIterations: number;

  @Column({ name: 'wrap_iv', type: 'bytea' })
  wrapIv: Buffer;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
