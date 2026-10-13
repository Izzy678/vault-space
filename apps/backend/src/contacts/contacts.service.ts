import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { VaultService } from '../vault/vault.service';
import { ActivityService } from '../activity/activity.service';
import { Contact } from './contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactsRepo: Repository<Contact>,
    private readonly usersService: UsersService,
    private readonly vaultService: VaultService,
    private readonly activityService: ActivityService,
  ) {}

  async list(ownerId: string) {
    const rows = await this.contactsRepo.find({
      where: { ownerId },
      order: { name: 'ASC' },
    });
    return rows.map((c) => this.toResponse(c));
  }

  async create(ownerId: string, dto: CreateContactDto) {
    const email = dto.email.toLowerCase();
    const owner = await this.usersService.findById(ownerId);
    if (owner && owner.email === email) {
      throw new BadRequestException('Cannot add yourself as a contact');
    }

    const existing = await this.contactsRepo.findOne({
      where: { ownerId, email },
    });
    if (existing) {
      throw new ConflictException('Contact already exists');
    }

    let publicKeyPem = dto.publicKeyPem;
    let fingerprint = dto.fingerprint;
    let contactUserId: string | null = null;
    let name = dto.name?.trim();

    if (!publicKeyPem || !fingerprint) {
      const other = await this.usersService.findByEmail(email);
      if (!other) {
        throw new BadRequestException(
          'No VaultSpace user with that email. Provide publicKeyPem and fingerprint manually.',
        );
      }
      try {
        const vault = await this.vaultService.getForUser(other.id);
        publicKeyPem = vault.publicKeyPem;
        fingerprint = vault.fingerprint;
        contactUserId = other.id;
        name = name || email.split('@')[0] || email;
      } catch {
        throw new BadRequestException(
          'That user has not set up a vault keypair yet.',
        );
      }
    }

    if (!publicKeyPem || !fingerprint) {
      throw new BadRequestException('publicKeyPem and fingerprint are required');
    }

    const contact = this.contactsRepo.create({
      ownerId,
      contactUserId,
      name: name || email.split('@')[0] || email,
      email,
      publicKeyPem,
      fingerprint,
      verified: false,
      hue: this.hueFromEmail(email),
    });

    const saved = await this.contactsRepo.save(contact);
    return this.toResponse(saved);
  }

  async setVerified(ownerId: string, id: string, verified: boolean) {
    const contact = await this.findOwned(ownerId, id);
    contact.verified = verified;
    const saved = await this.contactsRepo.save(contact);
    if (verified) {
      this.activityService.log(
        ownerId,
        'key',
        `${saved.name}'s public key verified`,
      );
    }
    return this.toResponse(saved);
  }

  async remove(ownerId: string, id: string) {
    const contact = await this.findOwned(ownerId, id);
    await this.contactsRepo.delete({ id: contact.id });
    return { deleted: true };
  }

  private async findOwned(ownerId: string, id: string) {
    const contact = await this.contactsRepo.findOne({ where: { id } });
    if (!contact || contact.ownerId !== ownerId) {
      throw new NotFoundException('Contact not found');
    }
    return contact;
  }

  private toResponse(c: Contact) {
    return {
      id: c.id,
      name: c.name,
      email: c.email,
      publicKeyPem: c.publicKeyPem,
      fingerprint: c.fingerprint,
      verified: c.verified,
      hue: c.hue,
      contactUserId: c.contactUserId,
      createdAt: c.createdAt,
    };
  }

  private hueFromEmail(email: string) {
    const hash = createHash('sha256').update(email).digest();
    return hash[0]! % 360;
  }
}
