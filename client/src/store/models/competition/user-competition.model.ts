import type {IUser} from "@/store/models/user/user.model";
import type {ICompetition} from "@/store/models/competition/competition.model";

export interface IUserCompetition {
    id?: number;
    result?: string;
    result_type?: string;
    user?: IUser;
    competition?: ICompetition;

    // addition
    user_ids?: number[]
    date_start?: Date
    date_end?: Date
}
