import {defineStore} from "pinia";
import axios from "axios";
import type {IUserCompetition} from "@/store/models/competition/user-competition.model";
import type {ISearchStandardDto} from "@/store/models/competition/standard-user.model";
import {ApiRequest} from "@/store/handleApiRequest";

export const useCompetitionStore = defineStore("competition", () => {
    let apiRequest = new ApiRequest();

    async function getAllUserCompetitions(dto: IUserCompetition) {
        const res = await axios.get("/api/competition/", {params: {...dto}});
        return res.data;
    }

    // --------------------------------------------------------------------------------------------------------------
    // user standard
    // --------------------------------------------------------------------------------------------------------------

    async function getUserStandard(dto: ISearchStandardDto) {
        return apiRequest.handleApiRequest(async () => {
            return await axios.get("/api/competition/standard", {params: {...dto}});
        });
    }

    return {
        getAllUserCompetitions,
        getUserStandards: getUserStandard
    };
});
