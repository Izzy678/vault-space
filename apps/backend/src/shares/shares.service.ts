import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityService } from '../activity/activity.service';
import { Contact } from '../contacts/contact.entity';
import { FileObject } from '../files/file-object.entity';
import { FileKeyMaterial } from '../files/file-key-material.entity';
import { NeonS3StorageAdapter } from '../storage/neon-s3.storage';
import { UsersService } from '../users/users.service';
import { CreateShareDto } from './dto/create-share.dto';
import { FileShare } from './file-share.entity';

@Injectable()
export class SharesService {
  constructor(
    @InjectRepository(FileShare)
    private readonly sharesRepo: Repository<FileShare>,
    @InjectRepository(FileObject)
    private readonly filesRepo: Repository<FileObject>,
    @InjectRepository(FileKeyMaterial)
    private readonly keysRepo: Repository<FileKeyMaterial>,
    @InjectRepository(Contact)
    private readonly contactsRepo: Repository<Contact>,
    private readonly usersService: UsersService,
    private readonly storage: NeonS3StorageAdapter,
    private readonly activityService: ActivityService,
  ) {}

  async create(ownerId: string, dto: CreateShareDto) {
    const file = await this.filesRepo.findOne({ where: { id: dto.fileId } });
    if (!file || file.ownerId !== ownerId) {
      throw new NotFoundException('File not found');
    }

    const recipient = await this.resolveRecipient(ownerId, dto);
    if (recipient.id === ownerId) {
      throw new BadRequestException('Cannot share a file with yourself');
    }

    const existing = await this.sharesRepo.findOne({
      where: { fileId: file.id, recipientUserId: recipient.id },
    });
    if (existing) {
      throw new ConflictException('Already shared with this person');
    }

    const share = this.sharesRepo.create({
      fileId: file.id,
      ownerId,
      recipientUserId: recipient.id,
      wrappedAesKey: Buffer.from(dto.wrappedAesKey, 'base64'),
      permission: dto.permission ?? 'download',
    });
    const saved = await this.sharesRepo.save(share);

    this.activityService.log(
      ownerId,
      'share',
      `Shared with ${recipient.email}`,
      file.originalName,
    );

    return this.toOutgoing(saved, file, recipient.email, recipient.name);
  }

  async listOutgoing(ownerId: string) {
    const rows = await this.sharesRepo.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
    return Promise.all(
      rows.map(async (s) => {
        const file = await this.filesRepo.findOne({ where: { id: s.fileId } });
        const recipient = await this.usersService.findById(s.recipientUserId);
        return this.toOutgoing(
          s,
          file,
          recipient?.email ?? 'unknown',
          recipient?.name ?? null,
        );
      }),
    );
  }

  async listIncoming(recipientUserId: string) {
    const rows = await this.sharesRepo.find({
      where: { recipientUserId },
      order: { createdAt: 'DESC' },
    });
    return Promise.all(
      rows.map(async (s) => {
        const file = await this.filesRepo.findOne({ where: { id: s.fileId } });
        const owner = await this.usersService.findById(s.ownerId);
        return {
          id: s.id,
          fileId: s.fileId,
          originalName: file?.originalName ?? 'Unknown file',
          mimeType: file?.mimeType ?? 'application/octet-stream',
          sizeBytes: file ? Number(file.sizeBytes) : 0,
          permission: s.permission,
          ownerEmail: owner?.email ?? 'unknown',
          ownerName: owner?.name ?? null,
          createdAt: s.createdAt,
          uploadedAt: file?.uploadedAt ?? s.createdAt,
          integrityVerified: file?.integrityVerified ?? null,
          shared: true as const,
        };
      }),
    );
  }

  async listForFile(ownerId: string, fileId: string) {
    const file = await this.filesRepo.findOne({ where: { id: fileId } });
    if (!file || file.ownerId !== ownerId) {
      throw new NotFoundException('File not found');
    }
    const rows = await this.sharesRepo.find({
      where: { fileId, ownerId },
      order: { createdAt: 'ASC' },
    });
    return Promise.all(
      rows.map(async (s) => {
        const recipient = await this.usersService.findById(s.recipientUserId);
        return {
          id: s.id,
          recipientEmail: recipient?.email ?? 'unknown',
          recipientName: recipient?.name ?? null,
          permission: s.permission,
          createdAt: s.createdAt,
        };
      }),
    );
  }

  async getForRecipient(userId: string, shareId: string) {
    const share = await this.sharesRepo.findOne({ where: { id: shareId } });
    if (!share) throw new NotFoundException('Share not found');
    if (share.recipientUserId !== userId && share.ownerId !== userId) {
      throw new ForbiddenException();
    }

    const file = await this.filesRepo.findOne({ where: { id: share.fileId } });
    if (!file) throw new NotFoundException('File not found');
    const material = await this.keysRepo.findOne({
      where: { fileId: file.id },
    });
    if (!material) throw new NotFoundException('Key material missing');

    const wrappedAesKey =
      share.recipientUserId === userId
        ? Buffer.from(share.wrappedAesKey).toString('base64')
        : Buffer.from(material.wrappedAesKey).toString('base64');

    return {
      id: share.id,
      fileId: file.id,
      originalName: file.originalName,
      mimeType: file.mimeType,
      sizeBytes: Number(file.sizeBytes),
      permission: share.permission,
      wrappedAesKey,
      iv: Buffer.from(material.iv).toString('base64'),
      authTag: Buffer.from(material.authTag).toString('base64'),
      createdAt: share.createdAt,
    };
  }

  async getContent(userId: string, shareId: string) {
    const share = await this.sharesRepo.findOne({ where: { id: shareId } });
    if (!share) throw new NotFoundException('Share not found');
    if (share.recipientUserId !== userId && share.ownerId !== userId) {
      throw new ForbiddenException();
    }

    const file = await this.filesRepo.findOne({ where: { id: share.fileId } });
    if (!file) throw new NotFoundException('File not found');

    const buffer = await this.storage.download(file.storageKey);
    this.activityService.log(
      userId,
      'download',
      share.recipientUserId === userId
        ? 'Downloaded shared file'
        : 'Downloaded and decrypted',
      file.originalName,
    );
    return { buffer, originalName: file.originalName };
  }

  async revoke(userId: string, shareId: string) {
    const share = await this.sharesRepo.findOne({ where: { id: shareId } });
    if (!share) throw new NotFoundException('Share not found');
    if (share.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can revoke a share');
    }
    const file = await this.filesRepo.findOne({ where: { id: share.fileId } });
    await this.sharesRepo.delete({ id: shareId });
    this.activityService.log(
      userId,
      'share',
      'Share revoked',
      file?.originalName ?? null,
    );
    return { deleted: true };
  }

  private async resolveRecipient(ownerId: string, dto: CreateShareDto) {
    if (dto.contactId) {
      const contact = await this.contactsRepo.findOne({
        where: { id: dto.contactId, ownerId },
      });
      if (!contact) throw new NotFoundException('Contact not found');
      if (!contact.contactUserId) {
        throw new BadRequestException(
          'That contact is not a VaultSpace user — add them by their VaultSpace email',
        );
      }
      const user = await this.usersService.findById(contact.contactUserId);
      if (!user) {
        throw new BadRequestException('Contact user no longer exists');
      }
      return user;
    }

    if (dto.recipientEmail) {
      const user = await this.usersService.findByEmail(dto.recipientEmail);
      if (!user) {
        throw new BadRequestException('No VaultSpace user with that email');
      }
      return user;
    }

    throw new BadRequestException('contactId or recipientEmail is required');
  }

  private toOutgoing(
    share: FileShare,
    file: FileObject | null | undefined,
    recipientEmail: string,
    recipientName: string | null,
  ) {
    return {
      id: share.id,
      fileId: share.fileId,
      originalName: file?.originalName ?? 'Unknown file',
      permission: share.permission,
      recipientEmail,
      recipientName,
      createdAt: share.createdAt,
    };
  }
}
