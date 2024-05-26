import {IsArray, IsOptional} from 'class-validator';

export class SearchCompetitionDto {
  @IsOptional()
  @IsArray()
  user_ids?: number[];
}
