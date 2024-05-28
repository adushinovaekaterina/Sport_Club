import {defineStore} from "pinia";
import axios from "axios";
import type {IUserCompetition} from "@/store/models/competition/user-competition.model";
import type {ICreateStandardDto, ISearchStandardDto} from "@/store/models/competition/standard-user.model";
import {ApiRequest} from "@/store/handleApiRequest";
import type {IUser} from "@/store/models/user/user.model";

export const useCompetitionStore = defineStore("competition", () => {
    let apiRequest = new ApiRequest();

    async function getAllUserCompetitions(dto: IUserCompetition):Promise<IUser[]> {
        const res = await axios.get("/api/competition/", {params: {...dto}});
        return res.data;
    }

    // --------------------------------------------------------------------------------------------------------------
    // user standard
    // --------------------------------------------------------------------------------------------------------------

    async function getUserStandards(dto: ISearchStandardDto) {
        return apiRequest.handleApiRequest(async () => {
            return await axios.get("/api/competition/standard", {params: {...dto}});
        });
    }

    async function updateCreateUserStandard(dto: ICreateStandardDto) {
        return apiRequest.handleApiRequest(async () => {
            return await axios.post("/api/competition/standard", {...dto});
        });
    }

    return {
        getAllUserCompetitions,
        getUserStandards,
        updateCreateUserStandard,
    };
});
