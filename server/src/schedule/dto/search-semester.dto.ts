import {IsArray, IsOptional} from "class-validator";

export class SearchSemesterDto {
  @IsOptional()
  @IsArray()
  values: number[];

  @IsOptional()
  date_start: string;

  @IsOptional()
  date_end: string;
}
