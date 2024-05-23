import type {IDictionary} from "@/store/models/dictionary/dictionary.model";

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
}
