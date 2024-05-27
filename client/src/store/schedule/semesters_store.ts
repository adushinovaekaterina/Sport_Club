import {defineStore} from "pinia";
import axios from "axios";
import {ApiRequest} from "@/store/handleApiRequest";
import type {ISearchSemester} from "@/store/models/schedule/semester.model";
import type {ICreatSemester} from "@/store/models/schedule/semester.model";
import type {ISemesterTemp} from "@/store/models/other";

export const useSemesterStore = defineStore("semester", () => {
    const apiRequest = new ApiRequest();

    async function getSemesters(dto: ISearchSemester): Promise<ISemesterTemp[]> {
        return apiRequest.handleApiRequest(async () => {
            return await axios.get("/api/schedule/semester", {params: dto});
        });
    }

    async function createUpdateSemester(dto: ICreatSemester) {
        return apiRequest.handleApiRequest(async () => {
            return await axios.post("/api/schedule/semester/", dto);
        });
    }

    return {
        createUpdateSemester,
        getSemesters,

        apiRequest
    };
});
