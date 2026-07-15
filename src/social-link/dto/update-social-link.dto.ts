import { SocialType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateSocialLinkDto {
  @IsEnum(SocialType)
  @IsOptional()
  type?: SocialType;

  @IsString()
  @IsOptional()
  value?: string;

  @IsString()
  @IsOptional()
  label?: string;
}
