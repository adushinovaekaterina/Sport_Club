import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStandardDto {

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  user_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  team_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  value: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  semester: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  standard_id: number;
}
