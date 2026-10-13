import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { ActivityService } from '../activity/activity.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly activityService: ActivityService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });
    const user = await this.usersService.create(
      dto.email,
      passwordHash,
      dto.name,
    );
    return this.tokenResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.activityService.log(user.id, 'auth', 'Signed in');
    return this.tokenResponse(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.usersService.updateName(userId, dto.name);
    return {
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  private tokenResponse(user: {
    id: string;
    email: string;
    name: string | null;
  }) {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
