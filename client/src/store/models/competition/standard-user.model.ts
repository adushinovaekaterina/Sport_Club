import type {IDictionary} from "@/store/models/dictionary/dictionary.model";
import type {IUser} from "@/store/models/user/user.model";

export interface IStandardUser {
    id?: number;
    value?: number;
    date_create?: Date;
    standard?: IDictionary;
    user?: IUser;
}

export interface ISearchStandardDto {
    user_id?: number;
    standard_id?:number
}

