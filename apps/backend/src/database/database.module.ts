import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { VaultKeyPackage } from '../vault/vault-key-package.entity';
import { FileObject } from '../files/file-object.entity';
import { FileKeyMaterial } from '../files/file-key-material.entity';
import { Contact } from '../contacts/contact.entity';
import { ActivityLog } from '../activity/activity-log.entity';
import { FileShare } from '../shares/file-share.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url =  config.get<string>('DATABASE_URL');

        if (!url) {
          throw new Error('DATABASE_URL or DATABASE_URL_POOLED is required');
        }

        return {
          type: 'postgres' as const,
          url,
          entities: [
            User,
            VaultKeyPackage,
            FileObject,
            FileKeyMaterial,
            Contact,
            ActivityLog,
            FileShare,
          ],
          synchronize: config.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
          ssl: url.includes('sslmode=verify-full')
            ? { rejectUnauthorized: false }
            : undefined,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
