import type {ITeam} from "@/store/models/teams/team.model";
import type {ISemester} from "@/store/models/schedule/semester.model";

export class CreateSemesterVisitsDto {
    team_id?: number;
    semester_id?: number;
    max_visits?: number;
}

export interface  ITeamSemesterVisits{
    id?: number;
    max_visits?: number;
    team?: ITeam;
    semester?: ISemester;
}
