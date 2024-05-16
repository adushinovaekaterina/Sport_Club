import { defineStore } from "pinia";
import axios from "axios";
import type {IUserCompetition} from "@/store/models/competition/user-competition.model";

export const useCompetitionStore = defineStore("competition", () => {
  async function getAll(dto: IUserCompetition) {
    const res = await axios.get("/api/competition/", {params:{...dto}});
    return res.data;
  }

  return {
    getAllUserCompetitions: getAll,
  };
});
