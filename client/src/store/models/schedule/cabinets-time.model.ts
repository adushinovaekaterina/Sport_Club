import type {IDictionary} from "@/store/models/dictionary/dictionary.model";
import type {ICabinet} from "@/store/models/schedule/cabinet.model";
import type {IUser} from "@/store/models/user/user.model";

export interface ICabinetsTime {
    id: number;
    time_start: string;
    time_end: string;
    repeat: boolean;
    date: string;
    user?: IUser;

    day_week?: IDictionary;
    cabinet?: ICabinet;
}

export interface ICabinetsTimeEdit {
    id_team_schedule?: number,
    id_cabinet?: number,
    team_id?: number,
    semester_id?: number,

    date?: Date,
    time_start?: string,
    time_end?: string,
    user_id?: number,
    repeat?: boolean
}

export interface ICabinetsTimeSearch {
    team_id?: number;
    semester_id?:number
    // for cabinets_time
    day_week_id?: number;
    time_start?: string;
    time_end?: string;
}
