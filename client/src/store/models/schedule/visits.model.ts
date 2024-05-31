import type {IUser} from "@/store/models/user/user.model";

export interface IVisit {
    date_visit: string
    id: number
    status_visit: boolean
    user: IUser
}

export class IUpdateVisit {
    user_id?: number
    team_id?: number;
    semester_id?:number;
    date_visit?: Date;
    comment?: string;
    status_visit?: boolean;
}
