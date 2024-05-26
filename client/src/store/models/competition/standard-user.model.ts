import type {IDictionary} from "@/store/models/dictionary/dictionary.model";
import type {IUser} from "@/store/models/user/user.model";

export interface IStandardUser {
    id?: number;
    value?: number;
    semester?: number,
    date_create?: Date;
    standard?: IDictionary;
    user?: IUser;
}

export interface ISearchStandardDto {
    user_ids?: number[];
    standard_id?:number
    semesters?: number[];
    team_id?: number;
}

export interface ICreateStandardDto {
    user_id?: number;
    team_id?: number;
    semester?: number;
    value?: number;
    standard_id?: number;
}

