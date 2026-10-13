import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ActivityLog,
  ActivityType,
} from './activity-log.entity';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityRepo: Repository<ActivityLog>,
  ) {}

  async list(ownerId: string, type?: string) {
    const where =
      type && type !== 'all'
        ? { ownerId, type: type as ActivityType }
        : { ownerId };

    const rows = await this.activityRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: 100,
    });

    return rows.map((r) => ({
      id: r.id,
      type: r.type,
      label: r.label,
      fileName: r.fileName,
      device: r.device,
      createdAt: r.createdAt,
    }));
  }

  async create(ownerId: string, dto: CreateActivityDto) {
    const row = this.activityRepo.create({
      ownerId,
      type: dto.type,
      label: dto.label,
      fileName: dto.fileName ?? null,
      device: dto.device ?? null,
    });
    const saved = await this.activityRepo.save(row);
    return {
      id: saved.id,
      type: saved.type,
      label: saved.label,
      fileName: saved.fileName,
      device: saved.device,
      createdAt: saved.createdAt,
    };
  }

  /** Fire-and-forget helper for other modules */
  log(
    ownerId: string,
    type: ActivityType,
    label: string,
    fileName?: string | null,
    device?: string | null,
  ) {
    void this.create(ownerId, {
      type,
      label,
      fileName: fileName ?? undefined,
      device: device ?? undefined,
    }).catch(() => undefined);
  }
}
