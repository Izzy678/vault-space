import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VaultModule } from './vault/vault.module';
import { StorageModule } from './storage/storage.module';
import { FilesModule } from './files/files.module';
import { ActivityModule } from './activity/activity.module';
import { ContactsModule } from './contacts/contacts.module';
import { SharesModule } from './shares/shares.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    VaultModule,
    StorageModule,
    FilesModule,
    ActivityModule,
    ContactsModule,
    SharesModule,
  ],
})
export class AppModule {}
