import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityModule } from '../activity/activity.module';
import { VaultKeyPackage } from './vault-key-package.entity';
import { VaultController } from './vault.controller';
import { VaultService } from './vault.service';

@Module({
  imports: [TypeOrmModule.forFeature([VaultKeyPackage]), ActivityModule],
  controllers: [VaultController],
  providers: [VaultService],
  exports: [VaultService],
})
export class VaultModule {}
