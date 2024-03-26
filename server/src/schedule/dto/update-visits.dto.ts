import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateVisitsDto {
  @IsNumber()
  @Type(() => Number)
  user_id: number;

  @IsNumber()
  @Type(() => Number)
  team_id: number;

  @IsString()
  date_visit: string;

  @IsOptional()
  @IsString()
  comment: string;

  @IsBoolean()
  @Type(() => Boolean)
  status_visit: boolean;
}
