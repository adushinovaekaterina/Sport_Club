export class FilterUser {
  email?: string;
  fullname?: string;
  searchTxt?:string;

  health_groups?:number[];
  institutes?:number[];
  states?:number[];
  courses?:number[];
  genders?:string[];

  limit = 5;
  offset = 0;
}
