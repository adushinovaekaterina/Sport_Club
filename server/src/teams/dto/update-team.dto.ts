import {Transform, Type} from 'class-transformer';
import {
  IsArray, IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Team } from '../entities/team.entity';

export class UpdateTeamDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_parent: Team;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  health_group_id:number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  capacity: number;

  @IsOptional()
  phone: string;

  @IsOptional()
  @Length(1, 100, {
    message: 'Название коллектива, максимальная длина текста 100',
  })
  title: string;

  @IsOptional()
  @Length(1, 3000, {
    message: 'Описание, максимальная длина текста 1-3000',
  })
  description: string;

  @IsOptional()
  @IsArray()
  leaders: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cabinets: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  is_national: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  links: string[];

  @IsOptional()
  @IsNotEmpty({ message: 'Ссылка на документ пустая' })
  @Length(1, 300, {
    message: 'Ссылка на документ, максимальная длина текста 300',
  })
  document: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Ссылка на устав пустая' })
  @Length(1, 300, {
    message: 'ССсылка на устав, максимальная длина текста 300',
  })
  charterTeam: string;

  get cabinetsAsNumbers(): number[] {
    return this.cabinets?.map((str) => parseInt(str));
  }
}
