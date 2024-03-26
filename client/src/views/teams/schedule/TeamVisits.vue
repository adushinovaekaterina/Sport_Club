<template>
    <div class="row">
        <div class="col-12 overflow-scroll">
            <table class="table">
                <thead>
                <tr>
                    <th></th>
                    <th v-for="(date, index2) in dates.dateRange" v-bind:key="index2">
                        <div class="text-center"> {{ formatDayOfWeek(date) }}</div>
                        <div class="text-center"> {{ date.toLocaleDateString() }}</div>
                    </th>
                </tr>

                </thead>
                <tbody>
                <tr v-for="participant in userVisits" :key="participant.name">
                    <td>{{ participant.user.fullname }} ({{ participant.counter }} / {{ maxVisits }})</td>
                    <td v-for="(date, index) in dates.dateRange" :key="index">
                        <label class="checkbox-label col-auto">
                            <input type="checkbox" :checked="participant.days[formatDate(date)]"
                                   @change="onChangeVisit( participant.user.id, participant.days[formatDate(date)], date)"/>
                            <div class="checkbox-custom"></div>
                        </label>

                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts" setup>

import type {Ref} from "vue";
import {onBeforeMount, ref, watch} from "vue";
import {formatDate, formatDayOfWeek} from "@/views/teams/schedule/format-date";
import type {IUserFunction} from "@/store/models/user/user-functions.model";
import {useTeamStore} from "@/store/team_store";
import type {IRUFunction} from "@/store/models/user/search-user-functions.model";
import type {IVisit} from "@/store/models/schedule/visits.model";
import {IUpdateVisit} from "@/store/models/schedule/visits.model";
import {TeamRoles} from "@/store/enums/team_roles";
import type {ITeam} from "@/store/models/teams/team.model";

interface Participant {
    [idUser: number]: { user: IUserFunction, days: { [day: string]: string | boolean }, counter: number }
}

const teamStore = useTeamStore();

const props = defineProps<{
    teamId: number,
    maxVisits: number,
    dates: {
        dateStart: Date;
        dateEnd: Date;
        dateRange: Date[];
        weeks: string[];
        formattedDate: string;
    };
}>();

const team: Ref<ITeam> = ref({});
const filter: Ref<IRUFunction> = ref({});
const teamUsersFunctions: Ref<IUserFunction[]> = ref([]);
const userVisits: Ref = ref<Participant>({});

onBeforeMount(async () => {
    await fetchUsers();
    await fetchVisits()
});

watch(() => props.dates.dateRange, async () => {
    await fetchVisits()
})

async function onChangeVisit(userId: number, visited: boolean | undefined, dateVisit: Date) {

    let v = visited ?? false

    dateVisit.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero

    const uV: IUpdateVisit = {}
    uV.date_visit = dateVisit
    uV.status_visit = !v
    uV.team_id = props.teamId
    uV.user_id = userId
    await teamStore.setVisit(uV).then(async () => {
        await fetchVisits()
    })

}

async function fetchUsers() {
    const data = await teamStore.fetchUsersOfTeam(props.teamId, filter.value);
    teamUsersFunctions.value = data[0]
}

async function fetchVisits() {
    const currentYear = new Date().getFullYear()
    const startOfYear = new Date(currentYear, 0, 1)
    const endOfYear = new Date(currentYear, 11, 31)

    const data = await teamStore.fetchVisits(startOfYear.toISOString(), endOfYear.toISOString(), props.teamId);

    await userVisitsFormat(data[0])
}

async function userVisitsFormat(usersVisits: IVisit[]) {
    userVisits.value = {}
    usersVisits.forEach((visit) => {
        const usrVisit = visit.user
        teamUsersFunctions.value.forEach((userFunction) => {
            const tUser = userFunction.user
            // console.log("userVisissts",usrVisit.id == tUser?.id , usrVisit.id, tUser?.id, userFunction)
            if (tUser?.id && userFunction.function?.title != TeamRoles.Leader) {
                // insert new user in list
                if (!userVisits.value[tUser.id]) {
                    userVisits.value[tUser.id] = {user: userFunction.user, days: {}, counter: 0}
                } else if (usrVisit.id == tUser?.id) {
                    // insert dates in user
                    const d = formatDate(new Date(visit.date_visit))
                    userVisits.value[tUser.id].days[d] = visit.status_visit

                    if (visit.status_visit) userVisits.value[tUser.id].counter += 1
                }

            }
        })
    })

}

</script>

<style lang="scss" scoped>
h3 {
  color: #959595;
}

.checkbox-custom {
  display: inline-block;
  position: relative;
  width: 1rem;
  height: 1rem;
  border-radius: 0.3rem;
  background-color: var(--second-color-50);

  &:hover {
    cursor: pointer;
    background-color: #b9e6e9;
  }

  &::before {
    content: "";
    display: block;
    width: 1rem;
    height: 1rem;
    background-color: var(--second-color);
    background-image: url(@/assets/icon/checked.svg);
    background-position: center;
    border-radius: 0.3rem;
    position: absolute;
    opacity: 0;
    transition: 0.2s;
  }
}

input[type="checkbox"] {
  display: none;

  &:checked ~ .checkbox-custom::before {
    opacity: 1;
    visibility: visible;
  }

  &:checked ~ .checkbox-text {
    color: #373737;
    text-decoration-line: none;
  }
}
</style>
