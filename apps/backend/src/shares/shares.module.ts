import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityModule } from '../activity/activity.module';
import { Contact } from '../contacts/contact.entity';
import { FileObject } from '../files/file-object.entity';
import { FileKeyMaterial } from '../files/file-key-material.entity';
import { StorageModule } from '../storage/storage.module';
import { UsersModule } from '../users/users.module';
import { FileShare } from './file-share.entity';
import { SharesController } from './shares.controller';
import { SharesService } from './shares.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileShare,
      FileObject,
      FileKeyMaterial,
      Contact,
    ]),
    UsersModule,
    StorageModule,
    ActivityModule,
  ],
  controllers: [SharesController],
  providers: [SharesService],
  exports: [SharesService],
})
export class SharesModule {}
