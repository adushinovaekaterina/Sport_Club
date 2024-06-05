import {
  IsArray, IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Team } from '../entities/team.entity';
import {Transform, Type} from 'class-transformer';

export class CreateTeamDto {

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_parent: Team;

  @Length(1, 100, {
    message: 'Название коллектива, максимальная длина текста 1-100',
  })
  title: string;

  @Length(1, 3000, {
    message: 'Описание, максимальная длина текста 1-3000',
  })
  description: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  is_national: boolean;

  @IsOptional()
  @IsArray()
  leaders: number[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  capacity: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cabinets: string[];

  get cabinetsAsNumbers(): number[] {
    return this.cabinets?.map((str) => parseInt(str));
  }
}
