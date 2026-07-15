import { SocialType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSocialLinkDto {
  @IsEnum(SocialType)
  type: SocialType;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsOptional()
  label?: string;
}
