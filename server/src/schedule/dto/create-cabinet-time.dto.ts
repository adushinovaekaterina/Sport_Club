import {IsBoolean, IsDateString, IsNumber, IsOptional} from 'class-validator';

export class CreateCabinetTimeDto {
    @IsOptional()
    @IsNumber()
    id_team_schedule: number;

    @IsOptional()
    @IsNumber()
    id_cabinet: number;

    @IsOptional()
    @IsNumber()
    user_id: number;

    @IsOptional()
    @IsNumber()
    team_id: number;

    @IsOptional()
    @IsNumber()
    semester_id: number;



    @IsOptional()
    time_start: string;

    @IsOptional()
    time_end: string;

    @IsDateString()
    date: Date;

    @IsOptional()
    @IsBoolean()
    repeat: boolean;
}
