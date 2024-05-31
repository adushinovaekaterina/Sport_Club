import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSemesterVisitsDto {

  @IsNumber()
  @Type(() => Number)
  team_id?: number;

  @IsNumber()
  @Type(() => Number)
  semester_id?: number;

  @IsNumber()
  @Type(() => Number)
  max_visits?: number;
}
