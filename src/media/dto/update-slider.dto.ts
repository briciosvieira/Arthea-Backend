import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateSliderDto {
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
