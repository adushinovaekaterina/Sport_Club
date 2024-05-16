import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchCompetitionDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  user_id: number;
}
