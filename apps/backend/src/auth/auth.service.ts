import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { ActivityService } from '../activity/activity.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  generateRecoveryCodes,
  generateTotpSecret,
  openSecret,
  qrDataUrlFromOtpauth,
  sealSecret,
  verifyTotpCode,
} from './totp.util';
import type { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly activityService: ActivityService,
    config: ConfigService,
  ) {
    this.jwtSecret = config.getOrThrow<string>('JWT_SECRET');
  }

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

    if (user.totpEnabled && user.totpSecret) {
      const preAuthToken = this.jwtService.sign(
        { sub: user.id, email: user.email, amr: 'pwd', purpose: '2fa' },
        { expiresIn: '5m' },
      );
      return {
        requires2fa: true as const,
        preAuthToken,
        user: { id: user.id, email: user.email, name: user.name },
      };
    }

    this.activityService.log(user.id, 'auth', 'Signed in');
    return this.tokenResponse(user);
  }

  async verifyLogin2fa(preAuthToken: string, code: string) {
    let payload: { sub: string; purpose?: string };
    try {
      payload = this.jwtService.verify(preAuthToken);
    } catch {
      throw new UnauthorizedException('2FA session expired — sign in again');
    }
    if (payload.purpose !== '2fa') {
      throw new UnauthorizedException('Invalid 2FA session');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user?.totpEnabled || !user.totpSecret) {
      throw new UnauthorizedException('2FA is not enabled');
    }

    const ok = await this.consumeTotpOrRecovery(user, code);
    if (!ok) {
      throw new UnauthorizedException('Invalid authenticator or recovery code');
    }

    this.activityService.log(user.id, 'auth', 'Signed in (2FA)');
    return this.tokenResponse(user);
  }

  async twofaStatus(userId: string) {
    const user = await this.requireUser(userId);
    return { enabled: !!user.totpEnabled };
  }

  async beginTwofaSetup(userId: string) {
    const user = await this.requireUser(userId);
    if (user.totpEnabled) {
      throw new BadRequestException('2FA is already enabled');
    }

    const { secret, otpauthUrl } = generateTotpSecret(user.email);
    user.totpSecret = sealSecret(secret, this.jwtSecret);
    user.totpEnabled = false;
    user.totpRecoveryHashes = null;
    await this.usersService.save(user);

    const qrDataUrl = await qrDataUrlFromOtpauth(otpauthUrl);
    return {
      secret,
      otpauthUrl,
      qrDataUrl,
    };
  }

  async enableTwofa(userId: string, code: string) {
    const user = await this.requireUser(userId);
    if (!user.totpSecret) {
      throw new BadRequestException('Start 2FA setup first');
    }
    if (user.totpEnabled) {
      throw new BadRequestException('2FA is already enabled');
    }

    const secret = openSecret(user.totpSecret, this.jwtSecret);
    if (!verifyTotpCode(secret, code)) {
      throw new BadRequestException('Invalid authenticator code');
    }

    const recoveryCodes = generateRecoveryCodes(8);
    const hashes = await Promise.all(
      recoveryCodes.map((c) =>
        argon2.hash(c.toUpperCase(), { type: argon2.argon2id }),
      ),
    );
    user.totpEnabled = true;
    user.totpRecoveryHashes = JSON.stringify(hashes);
    await this.usersService.save(user);

    this.activityService.log(userId, 'auth', 'Two-factor authentication enabled');
    return { enabled: true, recoveryCodes };
  }

  async disableTwofa(userId: string, code: string) {
    const user = await this.requireUser(userId);
    if (!user.totpEnabled || !user.totpSecret) {
      throw new BadRequestException('2FA is not enabled');
    }

    const ok = await this.consumeTotpOrRecovery(user, code);
    if (!ok) {
      throw new BadRequestException('Invalid authenticator or recovery code');
    }

    user.totpEnabled = false;
    user.totpSecret = null;
    user.totpRecoveryHashes = null;
    await this.usersService.save(user);

    this.activityService.log(userId, 'auth', 'Two-factor authentication disabled');
    return { enabled: false };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.usersService.updateName(userId, dto.name);
    return {
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  private async consumeTotpOrRecovery(user: User, code: string): Promise<boolean> {
    const cleaned = code.replace(/\s+/g, '').toUpperCase();
    if (/^\d{6}$/.test(cleaned) && user.totpSecret) {
      const secret = openSecret(user.totpSecret, this.jwtSecret);
      if (verifyTotpCode(secret, cleaned)) return true;
    }

    if (!user.totpRecoveryHashes) return false;
    let hashes: string[] = [];
    try {
      hashes = JSON.parse(user.totpRecoveryHashes) as string[];
    } catch {
      return false;
    }

    for (let i = 0; i < hashes.length; i++) {
      const hash = hashes[i];
      if (!hash) continue;
      try {
        if (await argon2.verify(hash, cleaned)) {
          hashes.splice(i, 1);
          user.totpRecoveryHashes = JSON.stringify(hashes);
          await this.usersService.save(user);
          return true;
        }
      } catch {
        /* try next */
      }
    }
    return false;
  }

  private async requireUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    return user;
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
      requires2fa: false as const,
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
