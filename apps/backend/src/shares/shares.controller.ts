import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, type AuthUser } from '../auth/current-user.decorator';
import { CreateShareDto } from './dto/create-share.dto';
import { SharesService } from './shares.service';

@Controller('shares')
@UseGuards(JwtAuthGuard)
export class SharesController {
  constructor(private readonly sharesService: SharesService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateShareDto) {
    return this.sharesService.create(user.id, dto);
  }

  @Get('outgoing')
  outgoing(@CurrentUser() user: AuthUser) {
    return this.sharesService.listOutgoing(user.id);
  }

  @Get('incoming')
  incoming(@CurrentUser() user: AuthUser) {
    return this.sharesService.listIncoming(user.id);
  }

  @Get('file/:fileId')
  forFile(
    @CurrentUser() user: AuthUser,
    @Param('fileId', ParseUUIDPipe) fileId: string,
  ) {
    return this.sharesService.listForFile(user.id, fileId);
  }

  @Get(':id')
  getOne(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.sharesService.getForRecipient(user.id, id);
  }

  @Get(':id/content')
  async content(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const { buffer, originalName } = await this.sharesService.getContent(
      user.id,
      id,
    );
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(originalName)}.enc"`,
    );
    res.send(buffer);
  }

  @Delete(':id')
  revoke(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.sharesService.revoke(user.id, id);
  }
}
