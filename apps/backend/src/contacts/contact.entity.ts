import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('contacts')
@Index(['ownerId', 'email'], { unique: true })
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  /** Optional linked VaultSpace user */
  @Column({ name: 'contact_user_id', type: 'uuid', nullable: true })
  contactUserId: string | null;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ name: 'public_key_pem', type: 'text' })
  publicKeyPem: string;

  @Column()
  fingerprint: string;

  @Column({ default: false })
  verified: boolean;

  /** Avatar hue 0–360 for UI */
  @Column({ type: 'int', default: 200 })
  hue: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
