import type { IFunction } from "@/store/models/user/functions.model";
import type {ITeamPhotos} from "@/store/models/teams/team-photos.model";
import type {ITeamSemesterVisits} from "@/store/models/teams/team-semester-visits.model";

export interface ITeam {
  id?: number;
  image?: string[];
  tags?: string[];
  description?: string;
  id_parent?: ITeam;
  title?: string;
  phone?: string;
  links?: string[];
  shortname?: string;
  cabinets?: number[];
  is_archive?: boolean;
  charter_team?: string;
  document?: string;
  short_description?: string;
  set_open?: boolean;
  capacity?:number;
  is_national?: boolean;
  team_semester_visits?:ITeamSemesterVisits[]

  team_photos?: ITeamPhotos[];
  functions?: IFunction[];

  count_members?:number
}
