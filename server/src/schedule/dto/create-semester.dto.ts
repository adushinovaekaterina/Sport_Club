import {IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class CreatSemesterDto {

  // @IsOptional()
  // @Type(() => Number)
  // @IsNumber()
  // id: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  value: number;

  @IsOptional()
  date_start: string;

  @IsOptional()
  date_end: string;

}
