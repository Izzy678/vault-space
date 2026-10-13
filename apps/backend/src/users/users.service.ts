import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email: email.toLowerCase() } });
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async create(
    email: string,
    passwordHash: string,
    name: string,
  ): Promise<User> {
    const user = this.usersRepo.create({
      email: email.toLowerCase(),
      passwordHash,
      name: name.trim(),
    });
    return this.usersRepo.save(user);
  }

  async updateName(userId: string, name: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.name = name.trim();
    return this.usersRepo.save(user);
  }
}
