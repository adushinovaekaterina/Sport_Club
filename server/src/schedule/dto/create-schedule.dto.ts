import { IsNumber, IsOptional} from 'class-validator';

export class CreateScheduleDto {

  @IsOptional()
  @IsNumber()
  team_id:number

  @IsOptional()
  @IsNumber()
  semester_id: number;
}
