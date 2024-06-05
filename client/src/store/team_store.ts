import {defineStore} from "pinia";
import {ref} from "vue";
import type UCTeamModel from "@/store/models/teams/u-c-team.model";
import type {FilterTeam} from "./models/teams/filter-teams.model";
import type {RURequisition} from "@/store/models/teams/update-requisition.model";
import axios from "axios";
import {ApiRequest} from "@/store/handleApiRequest";
import type {IRUFunction} from "./models/user/search-user-functions.model";
import type {ICreateRequisition} from "@/store/models/forms/requisition-fields.model";
import type {IUpdateVisit} from "@/store/models/schedule/visits.model";
import type {CreateSemesterVisitsDto, ITeamSemesterVisits} from "@/store/models/teams/team-semester-visits.model";

export const useTeamStore = defineStore("teams", () => {
    const layout = ref(true);
    let apiRequest = new ApiRequest();

    function refresh() {
        apiRequest = new ApiRequest()
    }

    async function setMaxVisits(teamId: number, maxVisits: number) {
        return (await axios.post(`/api/teams/${teamId}/max-visits/`, {max_visits: maxVisits})).data;
    }

    async function getUserRequisitions(id: number) {
        return (await axios.get("/api/teams/requisitions/user/" + id)).data;
    }

    async function deleteRequisition(id: number) {
        return apiRequest.handleApiRequest(async () => {
            return await axios.delete("/api/teams/requisition/" + id);
        });
    }

    async function fetchVisits(date_visit_start: string, date_visit_end: string, team_id: number, semester_id:number) {
        const res = await axios.get("/api/schedule/visits", {
            params: {
                date_visit_start,
                date_visit_end,
                team_id,
                semester_id
            },
        });
        return res.data;
    }

    async function setVisit(iUpdateVisit: IUpdateVisit) {
        const res = await axios.post("/api/schedule/visits", {
            ...iUpdateVisit
        })
        return res.data;
    }


    // data will be returned as index 0 - is data, index 1 is count
    async function fetchTeamsOfDirection(direction: number = -1) {
        const res = await axios.get("/api/teams/of-direction", {
            params: {id_parent: direction},
        });
        return res.data;
    }

    async function fetchDirections(direction: number = -1) {
        const dir = direction > 0 ? direction : null;
        const res = await axios.get("/api/teams/directions", {
            params: {id_parent: dir},
        });
        return res.data;
    }

    async function fetchUsersOfTeam(id: number, params: IRUFunction) {
        const res = await axios.get("/api/teams/" + id + "/users", {
            params: {...params},
        });
        return res.data;
    }

    async function fetchUserOfTeam(idTeam: number, idUser: number) {
        const res = await axios.get(`/api/teams/${idTeam}/users/${idUser}`);
        return res.data;
    }

    async function fetchTeam(id: number) {
        return apiRequest.handleApiRequest(async () => {
            return await axios.get("/api/teams/" + id);
        });
    }

    //create team
    async function createTeam(
        dto:UCTeamModel
    ) {
        const formData = new FormData();

        if (dto.id_parent > 0) {
            formData.append("id_parent", dto.id_parent.toString());
        }
        formData.append("capacity", dto.capacity.toString());
        formData.append("title", dto.title);
        formData.append("description", dto.description);
        formData.append("shortname", dto.shortname);
        formData.append("is_national", dto.is_national ? "true" : "false");
        //add leaders
        dto.leaders.forEach((el) => {
            formData.append("leaders[]", el.toString());
        });
        // cabinets
        for (let i = 0; i < dto.cabinets.length; i++) {
            formData.append("cabinets[]", dto.cabinets[i].toString());
        }

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        return apiRequest.handleApiRequest(async () => {
            return await axios.post("api/teams", formData, config);
        });
    }

    async function createRequisition(createRequisition: ICreateRequisition) {
        return apiRequest.handleApiRequest(async () => {
            return await axios.post("/api/teams/requisitions", {
                ...createRequisition,
            });
        });
    }

    // обновить коллектив
    async function updateTeam(uT: UCTeamModel) {

        const formData = new FormData();
        if (uT.id_parent > 0) {
            formData.append("id_parent", uT.id_parent.toString());
        }
        formData.append("capacity", uT.capacity.toString());
        formData.append("title", uT.title);
        formData.append("description", uT.description);
        formData.append("shortname", uT.shortname);
        formData.append("is_national", uT.is_national ? "true" : "false");

        // tags
        for (let i = 0; i < uT.tags.length; i++) {
            formData.append("tags[]", uT.tags[i].toString());
        }
        // links
        for (let i = 0; i < uT.links.length; i++) {
            formData.append("links[]", uT.links[i].toString());
        }
        // cabinets
        for (let i = 0; i < uT.cabinets.length; i++) {
            formData.append("cabinets[]", uT.cabinets[i].toString());
        }
        // leaders
        uT.leaders.forEach((el) => {
            formData.append("leaders[]", el.toString());
        });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        return apiRequest.handleApiRequest(async () => {
            return await axios.put("/api/teams/" + uT.id, formData, config);
        });
    }

    // архивировать или нет команду
    async function archiveTeam(id: number, isArchive: boolean) {
        return apiRequest.handleApiRequest(async () => {
            return await axios.put(`/api/teams/${id}/archive`, {
                isArchive: isArchive,
            });
        });
    }

    //fetch teams by some filters
    async function fetchTeamsSearch(filterTeam: FilterTeam) {
        //find by all txt data in table
        const res = await axios.get("/api/teams", {
            params: filterTeam,
        });

        return res.data;
    }

    // requisition --------------------------------------------------------------------
    //получить заявки
    async function fetchRequisitions(requisition: RURequisition) {
        return apiRequest.handleApiRequest(async () => {
            return await axios.get(
                "/api/teams/" + requisition?.team_id + "/requisition",
                {
                    params: {...requisition},
                },
            );
        });

        // const res = await axios.get("/api/teams/" + team_id + "/requisition", {
        //   params: { user_id: user_id > 0 ? user_id : null },
        // });
    }

    // обновить заявку
    async function updateRequisition(requisition: RURequisition) {
        return apiRequest.handleApiRequest(async () => {
            const {id, ...requestData} = requisition;
            return await axios.put(`/api/teams/requisition/${id}`, requestData);
        });
    }

    // TODO: обновить заявку в коллектив по ид юзера
    // update by user id
    // async function updateRequisitionByUserId(
    //     user_id: number,
    //     status_name: string,
    // ) {
    //     const res = await axios.put("/api/teams/requisition/", {
    //         status_name: status_name,
    //         user_id: user_id,
    //     });
    //
    //     return res.data;
    // }

    // requisition --------------------------------------------------------------------

    //задать нового участника
    async function assignNewParticipant(team_id: number, user_id: number) {
        const res = await axios.post("/api/teams/user-functions/new-participant", {
            user: user_id,
            team: team_id,
        });

        return res.data;
    }

    //  photos-------------------------------------------------------------
    async function deletePhotos(id: number) {
        return apiRequest.handleApiRequest(async () => {
            return await axios.delete(`/api/teams/photos/${id}`);
        });
    }

    async function addPhoto(id: number, file: File) {
        const formData = new FormData();
        formData.append("file", file);
        return apiRequest.handleApiRequest(async () => {
            return await axios.post(`/api/teams/${id}/photo`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        });
    }

    async function deleteAvs(teamId: number, image: string) {
        return apiRequest.handleApiRequest(async () => {
            return await axios.delete(`/api/teams/${teamId}/image`, {
                params: {path: image},
            });
        });
    }

    async function addImage(id: number, file: File) {
        const formData = new FormData();
        formData.append("file", file);

        return apiRequest.handleApiRequest(async () => {
            return await axios.post(`/api/teams/${id}/image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        });
    }

    //  photos-------------------------------------------------------------

    // Переключение Switch_toggle в стр. Коллективы и Мероприятия
    function setLayout(res: boolean) {
        layout.value = res;
    }

    // --------------------------------------------------------------------------------------------------------------
    // SemesterVisits
    // --------------------------------------------------------------------------------------------------------------

    async function createOrUpdateSemesterVisits(dto: CreateSemesterVisitsDto) {
        return apiRequest.handleApiRequest(async () => {
            return await axios.post(`/api/teams/semester-visits`, {...dto});
        });
    }


    async function fetchSemesterVisits(dto: CreateSemesterVisitsDto): Promise<ITeamSemesterVisits> {
        const res = await axios.get("/api/teams/semester-visits", {
            params: dto,
        });

        return res.data;
    }


    const menu_items = [
        {
            id: 1,
            title: "Набор",
            hidden: true,
            menu_types: [
                {id: 1, title: "Набор открыт", checked: false},
                {id: 2, title: "Набор закрыт", checked: false},
            ],
        },
        {
            id: 2,
            title: "Вид спорта",
            hidden: true,
            menu_types: [
                // {id: 1, title: "Командный", checked: true},
                // {id: 2, title: "Индивидуальный", checked: true},

                // { id: 1, title: "Научная деятельность", checked: true },
                // { id: 2, title: "Учебная деятельность", checked: true },
                // { id: 3, title: "Общественная деятельность", checked: true },
                // { id: 4, title: "Спортивная деятельность", checked: true },
                // { id: 5, title: "Культурно-творческая деятельность", checked: true },
            ],
        },
        {
            id: 3,
            title: "Тип команды",
            hidden: true,
            menu_types: [
                {id: 1, title: "Архивная", checked: false},
                {id: 2, title: "Действующая", checked: true},
            ],
        },
    ];

    return {
        createTeam,
        setLayout,
        fetchTeamsOfDirection,
        fetchUsersOfTeam: fetchUsersOfTeam,
        fetchTeam,
        updateTeam,
        archiveTeam,

        deleteRequisition,
        updateRequisition,
        fetchRequisitions,
        getUserRequisitions,

        fetchVisits,
        fetchTeamsSearch,
        fetchDirections,
        createRequisition,

        // assign roles
        assignNewParticipant,

        addImage,
        deleteAvs,
        deletePhotos,
        addPhoto,

        refresh,
        setVisit,
        setMaxVisits,
        fetchUserOfTeam,

        createOrUpdateSemesterVisits,
        fetchSemesterMaxVisits: fetchSemesterVisits,

        layout,
        menu_items,
        apiRequest,
    };
});
