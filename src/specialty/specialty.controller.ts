import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { SpecialtyService } from './specialty.service';

@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Get()
  findAll() {
    return this.specialtyService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateSpecialtyDto) {
    return this.specialtyService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialtyService.remove(id);
  }
}
