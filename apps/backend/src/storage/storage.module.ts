import { Module } from '@nestjs/common';
import { NeonS3StorageAdapter } from './neon-s3.storage';

@Module({
  providers: [
    NeonS3StorageAdapter,
    {
      provide: 'STORAGE_ADAPTER',
      useExisting: NeonS3StorageAdapter,
    },
  ],
  exports: [NeonS3StorageAdapter, 'STORAGE_ADAPTER'],
})
export class StorageModule {}
