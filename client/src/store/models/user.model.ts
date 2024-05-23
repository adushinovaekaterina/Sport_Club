export class FilterUser {
  email?: string;
  fullname?: string;
  searchTxt?:string;

  health_groups?:number[];
  institutes?:number[];
  states?:number[];

  limit = 5;
  offset = 0;
}
