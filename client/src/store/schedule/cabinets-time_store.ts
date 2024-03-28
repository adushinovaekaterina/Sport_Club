import {defineStore} from "pinia";
import axios from "axios";
import {ApiRequest} from "@/store/handleApiRequest";
import type {ICabinetsTime, ICabinetsTimeEdit, ICabinetsTimeSearch} from "@/store/models/schedule/cabinets-time.model";
import type {ISchedule} from "@/store/models/schedule/schedule.model";

export const useCabinetsTimeStore = defineStore("cabinets-time", () => {
    const apiRequest = new ApiRequest();

    async function getCabinetsTime(sch: ICabinetsTimeSearch): Promise<ISchedule> {
        return apiRequest.handleApiRequest(async () => {
            return await axios.get("/api/schedule/", {params: sch});
        });
    }

    async function setCabinetsTime(cT: ICabinetsTimeEdit) {
        return apiRequest.handleApiRequest(async () => {
            return await axios.post("/api/schedule/cabinets-time", cT);
        });
    }

    async function deleteCabinetsTime(id: number) {
        return apiRequest.handleApiRequest(async () => {
            return await axios.delete("/api/schedule/cabinets-time/" + id);
        });
    }

    return {
        getCabinetsTime,
        setCabinetsTime,
        deleteCabinetsTime,

        apiRequest
    };
});
