import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchScheduleDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  team_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  semester_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  semester_value?: number;

  // for cabinets_time
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  day_week_id?: number;

  @IsOptional()
  time_start?: string;

  @IsOptional()
  time_end?: string;

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // additional
}
