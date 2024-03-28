import type {ICabinetsTime} from "@/store/models/schedule/cabinets-time.model";

export interface IScheduleSearch {
  // find
  ids?: number[];
}

export interface ISchedule {
  id?:number;
  cabinets_time?: ICabinetsTime[];
}

