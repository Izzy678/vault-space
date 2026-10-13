import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  TotpCodeDto,
  TotpDisableDto,
  TotpLoginDto,
} from './dto/totp-code.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser, type AuthUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('2fa/login')
  verifyLogin2fa(@Body() dto: TotpLoginDto) {
    return this.authService.verifyLogin2fa(dto.preAuthToken, dto.code);
  }

  @Get('2fa')
  @UseGuards(JwtAuthGuard)
  twofaStatus(@CurrentUser() user: AuthUser) {
    return this.authService.twofaStatus(user.id);
  }

  @Post('2fa/setup')
  @UseGuards(JwtAuthGuard)
  beginTwofaSetup(@CurrentUser() user: AuthUser) {
    return this.authService.beginTwofaSetup(user.id);
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  enableTwofa(@CurrentUser() user: AuthUser, @Body() dto: TotpCodeDto) {
    return this.authService.enableTwofa(user.id, dto.code);
  }

  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  disableTwofa(@CurrentUser() user: AuthUser, @Body() dto: TotpDisableDto) {
    return this.authService.disableTwofa(user.id, dto.code);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateProfile(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(user.id, dto);
  }
}
