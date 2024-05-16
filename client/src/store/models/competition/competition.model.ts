import type {IUserCompetition} from "@/store/models/competition/user-competition.model";
import type {IDictionary} from "@/store/models/dictionary/dictionary.model";

export interface ICompetition {
    id?: number;
    name?: string;
    sport_type?: string;
    city?: string;
    date_start?: string;
    date_end?: string;
    level?: IDictionary;
    users: IUserCompetition[];
}
