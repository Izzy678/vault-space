import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../storage/storage.module';
import { ActivityModule } from '../activity/activity.module';
import { FileObject } from './file-object.entity';
import { FileKeyMaterial } from './file-key-material.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileObject, FileKeyMaterial]),
    StorageModule,
    ActivityModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
