import type {ICabinet} from "@/store/models/schedule/cabinet.model";
import type {IUser} from "@/store/models/user/user.model";
export interface TimeData {
    [time: string]: {
        id: number;
        cabinet: ICabinet | null;
        user: IUser | null;
        endTime: string;
        date: Date;
        repeat: boolean;
    }[];
}

export interface DayWeek {
    [dayWeek: string]: TimeData;
}
