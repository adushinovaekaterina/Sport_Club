import {IsArray, IsNumber, IsOptional} from 'class-validator';
import { Type } from 'class-transformer';

export class SearchStandardDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  user_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  standard_id:number

  @IsOptional()
  @IsArray()
  semesters: number[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  team_id: number;
}
