import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SliderSection } from '@prisma/client';
import { memoryStorage } from 'multer';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UpdateHeroTypeDto } from './dto/update-hero-type.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { MediaService } from './media.service';

const uploadConfig = { storage: memoryStorage() };

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // ─── Hero ─────────────────────────────────────────────────────────────────

  @Get('hero')
  getHero() {
    return this.mediaService.getHero();
  }

  @UseGuards(AuthGuard)
  @Patch('hero/type')
  updateHeroType(@Body() dto: UpdateHeroTypeDto) {
    return this.mediaService.updateHeroType(dto.type);
  }

  @UseGuards(AuthGuard)
  @Post('hero/video')
  @UseInterceptors(FileInterceptor('file', uploadConfig))
  uploadHeroVideo(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.uploadHeroVideo(file);
  }

  @UseGuards(AuthGuard)
  @Post('hero/image')
  @UseInterceptors(FileInterceptor('file', uploadConfig))
  uploadHeroImage(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.uploadHeroImage(file);
  }

  // ─── Sliders ──────────────────────────────────────────────────────────────

  @Get('slider/:section')
  getSliderImages(
    @Param('section', new ParseEnumPipe(SliderSection)) section: SliderSection,
  ) {
    return this.mediaService.getSliderImages(section);
  }

  @UseGuards(AuthGuard)
  @Post('slider/:section')
  @UseInterceptors(FileInterceptor('file', uploadConfig))
  addSliderImage(
    @Param('section', new ParseEnumPipe(SliderSection)) section: SliderSection,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaService.addSliderImage(section, file);
  }

  @UseGuards(AuthGuard)
  @Patch('slider/:section/:id')
  updateSliderImage(
    @Param('section', new ParseEnumPipe(SliderSection)) section: SliderSection,
    @Param('id') id: string,
    @Body() dto: UpdateSliderDto,
  ) {
    return this.mediaService.updateSliderImage(section, id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete('slider/:section/:id')
  deleteSliderImage(
    @Param('section', new ParseEnumPipe(SliderSection)) section: SliderSection,
    @Param('id') id: string,
  ) {
    return this.mediaService.deleteSliderImage(section, id);
  }

  // ─── Quem Somos ───────────────────────────────────────────────────────────

  @Get('quem-somos')
  getQuemSomos() {
    return this.mediaService.getQuemSomos();
  }

  @UseGuards(AuthGuard)
  @Post('quem-somos/:position')
  @UseInterceptors(FileInterceptor('file', uploadConfig))
  upsertQuemSomos(
    @Param('position', ParseIntPipe) position: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaService.upsertQuemSomos(position, file);
  }

  @UseGuards(AuthGuard)
  @Delete('quem-somos/:position')
  deleteQuemSomos(@Param('position', ParseIntPipe) position: number) {
    return this.mediaService.deleteQuemSomos(position);
  }
}
