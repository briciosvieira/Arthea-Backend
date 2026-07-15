import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { SocialLinkService } from './social-link.service';

@Controller('social-links')
export class SocialLinkController {
  constructor(private readonly socialLinkService: SocialLinkService) {}

  @Get()
  findAll() {
    return this.socialLinkService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateSocialLinkDto) {
    return this.socialLinkService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSocialLinkDto) {
    return this.socialLinkService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialLinkService.remove(id);
  }
}
