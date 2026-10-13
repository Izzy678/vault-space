import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityService } from '../activity/activity.service';
import { VaultKeyPackage } from './vault-key-package.entity';
import { UpsertVaultDto } from './dto/upsert-vault.dto';

@Injectable()
export class VaultService {
  constructor(
    @InjectRepository(VaultKeyPackage)
    private readonly vaultRepo: Repository<VaultKeyPackage>,
    private readonly activityService: ActivityService,
  ) {}

  async getForUser(userId: string) {
    const vault = await this.vaultRepo.findOne({ where: { userId } });
    if (!vault) {
      throw new NotFoundException('Vault not set up');
    }
    return this.toResponse(vault);
  }

  async createForUser(userId: string, dto: UpsertVaultDto) {
    const existing = await this.vaultRepo.findOne({ where: { userId } });
    if (existing) {
      throw new ConflictException('Vault already set up');
    }

    const vault = this.vaultRepo.create({
      userId,
      publicKeyPem: dto.publicKeyPem,
      fingerprint: dto.fingerprint,
      wrappedPrivateKey: Buffer.from(dto.wrappedPrivateKey, 'base64'),
      kdfSalt: Buffer.from(dto.kdfSalt, 'base64'),
      kdfIterations: dto.kdfIterations,
      wrapIv: Buffer.from(dto.wrapIv, 'base64'),
      status: 'active',
    });

    const saved = await this.vaultRepo.save(vault);
    this.activityService.log(
      userId,
      'key',
      'Keypair generated (RSA-2048)',
    );
    return this.toResponse(saved);
  }

  /** Replace key package after passphrase change or keypair rotation (client-side crypto). */
  async replaceForUser(
    userId: string,
    dto: UpsertVaultDto,
    reason: 'passphrase' | 'rotate' = 'passphrase',
  ) {
    const vault = await this.vaultRepo.findOne({ where: { userId } });
    if (!vault) {
      throw new NotFoundException('Vault not set up');
    }

    vault.publicKeyPem = dto.publicKeyPem;
    vault.fingerprint = dto.fingerprint;
    vault.wrappedPrivateKey = Buffer.from(dto.wrappedPrivateKey, 'base64');
    vault.kdfSalt = Buffer.from(dto.kdfSalt, 'base64');
    vault.kdfIterations = dto.kdfIterations;
    vault.wrapIv = Buffer.from(dto.wrapIv, 'base64');

    const saved = await this.vaultRepo.save(vault);
    this.activityService.log(
      userId,
      'key',
      reason === 'rotate'
        ? 'Keypair rotated (RSA-2048)'
        : 'Vault passphrase changed',
    );
    return this.toResponse(saved);
  }

  private toResponse(vault: VaultKeyPackage) {
    return {
      publicKeyPem: vault.publicKeyPem,
      fingerprint: vault.fingerprint,
      wrappedPrivateKey: Buffer.from(vault.wrappedPrivateKey).toString('base64'),
      kdfSalt: Buffer.from(vault.kdfSalt).toString('base64'),
      kdfIterations: vault.kdfIterations,
      wrapIv: Buffer.from(vault.wrapIv).toString('base64'),
      status: vault.status,
      createdAt: vault.createdAt,
    };
  }
}
