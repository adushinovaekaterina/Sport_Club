import {IsArray, IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class FindUserDto {

  @IsOptional()
  email?: string;

  @IsOptional()
  fullname?: string;

  @IsOptional()
  searchTxt?:string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  course:number

  @IsOptional()
  gender:string

  @IsOptional()
  @IsArray()
  health_groups:number[];

  @IsOptional()
  @IsArray()
  institutes:number[];

  @IsOptional()
  @IsArray()
  states:number[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit = 5;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset = 0;
}
