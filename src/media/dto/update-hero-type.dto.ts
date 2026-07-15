import { IsEnum } from 'class-validator';
import { HeroType } from '@prisma/client';

export class UpdateHeroTypeDto {
  @IsEnum(HeroType)
  type: HeroType;
}
