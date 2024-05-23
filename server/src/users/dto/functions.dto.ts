import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FunctionDto {
  @IsOptional()
  title: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  team: number;
}
