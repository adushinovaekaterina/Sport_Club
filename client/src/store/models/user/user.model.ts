import type {IDictionary} from "@/store/models/dictionary/dictionary.model";
import type {IStandardUser} from "@/store/models/competition/standard-user.model";
import type {IUserCompetition} from "@/store/models/competition/user-competition.model";

export interface IUser {
  id?: number;
  name?: string;
  fullname?: string;
  education_group?: string;
  birthdate?: string;
  gender?: string;
  email?: string;
  phone?: string;
  image?: string;
  institute?: IDictionary;
  course?: number;
  health_group?: IDictionary;
  state?: IDictionary;
  standard_user?:IStandardUser[]
  user_competition?:IUserCompetition[]
}
