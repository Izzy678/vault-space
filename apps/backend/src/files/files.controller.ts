import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, type AuthUser } from '../auth/current-user.decorator';
import { FilesService } from './files.service';
import { IntegrityDto } from './dto/integrity.dto';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.filesService.listForUser(user.id);
  }

  @Get(':id')
  getOne(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.filesService.getMetadata(user.id, id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('ciphertext', {
      storage: memoryStorage(),
      limits: { fileSize: 60 * 1024 * 1024 },
    }),
  )
  upload(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body()
    body: {
      originalName?: string;
      mimeType?: string;
      wrappedAesKey?: string;
      iv?: string;
      authTag?: string;
    },
  ) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('ciphertext file is required');
    }
    if (
      !body.originalName ||
      !body.wrappedAesKey ||
      !body.iv ||
      !body.authTag
    ) {
      throw new BadRequestException(
        'originalName, wrappedAesKey, iv, and authTag are required',
      );
    }

    return this.filesService.upload(user.id, file.buffer, {
      originalName: body.originalName,
      mimeType: body.mimeType ?? 'application/octet-stream',
      wrappedAesKey: body.wrappedAesKey,
      iv: body.iv,
      authTag: body.authTag,
    });
  }

  @Get(':id/content')
  async content(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const { buffer, originalName } = await this.filesService.getContent(
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

  @Get(':id/signed-url')
  signedUrl(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.filesService.getSignedUrl(user.id, id);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.filesService.remove(user.id, id);
  }

  @Post(':id/integrity')
  integrity(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: IntegrityDto,
  ) {
    return this.filesService.setIntegrity(user.id, id, dto.verified);
  }
}
