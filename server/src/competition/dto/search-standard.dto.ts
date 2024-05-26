import {IsArray, IsNumber, IsOptional} from 'class-validator';
import { Type } from 'class-transformer';

export class SearchStandardDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsArray()
  user_ids?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  standard_id:number

  @IsOptional()
  @IsArray()
  semesters: number[];

  // 2 values
  @IsOptional()
  @IsArray()
  semestersRange?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  team_id: number;
}
