export default class UCTeamModel {
  id = 0;
  leaders: number[] = [];
  title = "";
  description = "";
  shortname = "";
  cabinets: number[] = [];
  capacity: number = 1;
  health_group_id?: number;
  phone: string = "";
  id_parent = 0;
  is_national = false;
  tags:string[] = [];
  links:string[] = [];
}
