import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VaultKeyPackage } from '../vault/vault-key-package.entity';
import { FileObject } from '../files/file-object.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  name: string | null;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => VaultKeyPackage, (vault) => vault.user)
  vaultKeyPackage?: VaultKeyPackage;

  @OneToMany(() => FileObject, (file) => file.owner)
  files?: FileObject[];
}
