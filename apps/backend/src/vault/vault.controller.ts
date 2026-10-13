import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, type AuthUser } from '../auth/current-user.decorator';
import { VaultService } from './vault.service';
import { UpsertVaultDto } from './dto/upsert-vault.dto';

@Controller('vault')
@UseGuards(JwtAuthGuard)
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  @Get()
  get(@CurrentUser() user: AuthUser) {
    return this.vaultService.getForUser(user.id);
  }

  @Put()
  put(@CurrentUser() user: AuthUser, @Body() dto: UpsertVaultDto) {
    return this.vaultService.createForUser(user.id, dto);
  }

  @Patch()
  patch(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpsertVaultDto,
    @Query('reason') reason?: string,
  ) {
    const kind = reason === 'rotate' ? 'rotate' : 'passphrase';
    return this.vaultService.replaceForUser(user.id, dto, kind);
  }
}
