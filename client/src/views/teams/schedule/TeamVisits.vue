<template>
    standardsAvgPoints {{ standardsAvgPoints }}
    <h6 class="fw-bold my-4">ПОСЕЩАЕМОСТЬ</h6>
    <p> Всего занятий: {{ maxVisits }}</p>
    <div class="row">
        <div class="chart-container">
            <EHalfPie :data="dataPie" :name="'Прогресс'"/>
        </div>
    </div>
    <div class="row" v-if="currUserF.function ?.title == TeamRoles.Leader || can('can create teams')">
        <div class="col-12 overflow-scroll">
            <table class="table">
                <thead>
                <tr>
                    <th></th>
                    <th v-for="(date, index2) in dates.dateRange" v-bind:key="index2">
                        <div class="text-center"> {{ formatDayOfWeek(date) }}</div>
                        <div class="text-center"> {{ date.toLocaleDateString() }}</div>
                    </th>
                    <th>Нормативы (3 балла для зачета) начало/конец семестра</th>
                    <th> Посещаемость (94% для зачета)</th>
                </tr>

                </thead>
                <tbody>
                <tr v-for="participant in userVisits" :key="participant.name">
                    <td v-if="!isNational">
                        <router-link :to="{name:'Progress', params:{id:teamId}, query:{user_id: participant.user.id}}">
                            {{ participant.user.fullname }} <span class="text-danger">({{ participant.counter }} / {{
                                maxVisits
                            }})</span>
                        </router-link>
                    </td>
                    <td v-else>
                        {{ participant.user.fullname }} <span
                            class="text-danger">({{ participant.counter }} / {{ maxVisits }})</span>
                    </td>

                    <td v-for="(date, index) in dates.dateRange" :key="index">
                        <label class="checkbox-label col-auto">
                            <input type="checkbox" :checked="participant.days[formatDate(date)]"
                                   @change="onChangeVisit( participant.user.id, participant.days[formatDate(date)], date)"/>

                            <div class="checkbox-custom">
                            </div>
                        </label>
                    </td>

                    <td> {{ standardsAvgPoints[participant.user.id]?.avgStart }}
                        / {{ standardsAvgPoints[participant.user.id]?.avgEnd }}
                    </td>
                    <td>

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
import EHalfPie from "@/components/charts/EHalfPie.vue";
import {usePermissionsStore} from "@/store/permissions_store";
import type {IUserCompetition} from "@/store/models/competition/user-competition.model";
import {useCompetitionStore} from "@/store/competition/competition_store";
import type {ISemester} from "@/store/models/other";
import type {IUser} from "@/store/models/user/user.model";
import type {ISearchStandardDto} from "@/store/models/competition/standard-user.model";
import type {IDictionary} from "@/store/models/dictionary/dictionary.model";
import {useDictionaryStore} from "@/store/dictionary_store";
import {convertValueToPoint} from "@/views/teams/progress/functions";

interface Participant {
    [idUser: number]: {
        user: IUserFunction,
        days: { [day: string]: string | boolean },
        counter: number
    }
}

const permissions_store = usePermissionsStore();
const teamStore = useTeamStore();
const competitionsStore = useCompetitionStore();
const dictStore = useDictionaryStore();

const can = permissions_store.can;

const props = defineProps<{
    teamId: number,
    maxVisits: number,
    isNational: boolean,
    dates: {
        dateStart: Date;
        dateEnd: Date;
        dateRange: Date[];
        weeks: string[];
        formattedDate: string;
    };
    semester: ISemester,

}>();

const team: Ref<ITeam> = ref({});
const filter: Ref<IRUFunction> = ref({});
const teamUsersFunctions: Ref<IUserFunction[]> = ref([]);
const userVisits = ref<Participant>({});
const uCompetitionsCurrent = ref<IUserCompetition[]>([]);
const sumCompVisitsPercents = ref(0)

const currUserF = ref<IUserFunction>({})


const standardsNames: Ref<IDictionary[]> = ref([]);

const dataPie = ref<{
    value: number,
    name: string
} []>([])


const standardsAvgPoints = ref<IUserAvgPoints>([]);

interface IUserAvgPoints {
    [userId: number]: {
        avgStart: number,
        avgEnd: number
    }
}

interface IUserVisits {
    [userId: number]: {
        percentCompetitions: number,
        visits: number,
    }
}


onBeforeMount(async () => {
    await getUserCompetitionsCurrentUser()
    await fetchUsers();
    await fetchVisits();

    await fetchNamesStandards()
    await fetchUserStandards();
});

watch(() => props.dates.dateRange, async () => {
    await fetchVisits()
})

watch(() => props.semester, async () => {
    await fetchUserStandards()
})

async function getUserCompetitions(userIds: number[]) {

    return await competitionsStore.getAllUserCompetitions(
        {user_ids: userIds}
    )
}


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
    let usrIds = Object.keys(userVisits.value).map(Number);
    const userCompetitions: IUser[] = await getUserCompetitions(usrIds)
    const usrVisits: IUserVisits = {}
    // users
    userCompetitions.forEach((userComp) => {
        if (userComp.id) {
            usrVisits[userComp.id] = {percentCompetitions: 0, visits: 0}
            // competition
            userComp.user_competition?.forEach((competition) => {
                const dS = new Date(competition.competition?.date_start ?? 0)
                const dE = new Date(competition.competition?.date_end ?? 0)
                const persVisits = datesCompetInPercents(dS, dE)
            })
        }

    })

    const currDateStart = props.dates.dateStart
    const currentYear = currDateStart.getFullYear()
    const startOfYear = new Date(currentYear, 0, 1)
    const endOfYear = new Date(currentYear, 11, 31)

    const data = await teamStore.fetchVisits(startOfYear.toISOString(), endOfYear.toISOString(), props.teamId);

    await userVisitsFormat(data[0])
    await setDataPie()
}


async function setDataPie() {
    dataPie.value = []
    // userVisits
    let usrV = userVisits.value[permissions_store.user_id]
    let freeVisits: number
    let maxVisits = props.maxVisits

    let minimumVisits: number
    // Посещения
    // сколько 1 визит в процентах
    let onePerVisit = 100 / props.maxVisits
    // получить соревнования проценты с ограничением 20%
    let competitionPercents = sumCompVisitsPercents.value > 20 ? 20 : sumCompVisitsPercents.value
    // перевести соревнования из процентов в посещения
    let competitionInVisits = Math.round(competitionPercents / onePerVisit)
    // console.log("competitionInVisits", maxVisits, props.maxVisits, onePerVisit, competitionInVisits, competitionPercents, sumCompVisitsPercents.value)
    if (usrV && usrV.counter) {
        // сложить посещения и участия в соревнованиях
        let visitedWithCompetition = Math.round(usrV.counter + competitionInVisits)
        dataPie.value.push({
            value: (usrV.counter < maxVisits ? usrV.counter : maxVisits),
            name: 'Занятий посещено'
        })

        dataPie.value.push({
            value: (competitionInVisits < maxVisits ? competitionInVisits : maxVisits),
            name: 'Закрытая посещаемость за счет участия в соревнованиях'
        })

        // минимум занятий, которое надо посетить для получения 3 баллов - visitedWithCompetition
        minimumVisits = Math.round(((maxVisits / 100) * 94))
        // осталось посетить
        const needVisit = minimumVisits - visitedWithCompetition
        dataPie.value.push({value: needVisit, name: 'Занятий осталось посетить для получения зачета'})
        // можно не ходить
        freeVisits = maxVisits - minimumVisits
        dataPie.value.push({value: freeVisits, name: 'Оставшиеся занятия'})
    }
}


async function userVisitsFormat(usersVisits: IVisit[]) {
    userVisits.value = {}

    teamUsersFunctions.value.forEach((userFunction) => {
        const tUser = userFunction.user

        // get curr user
        if (permissions_store.user_id == tUser?.id) {
            currUserF.value = userFunction
        }

        if (tUser?.id && userFunction.function?.title != TeamRoles.Leader && userFunction?.user)
            userVisits.value[tUser.id] = {user: userFunction?.user, days: {}, counter: 0}

        usersVisits.forEach((visit) => {
            const usrVisit = visit.user
            // console.log("userVisissts",usrVisit.id == tUser?.id , usrVisit.id, tUser?.id, userFunction)
            if (tUser?.id && userFunction.function?.title != TeamRoles.Leader) {
                // insert new user in list
                if (usrVisit.id == tUser?.id) {
                    // insert dates in user
                    const d = formatDate(new Date(visit.date_visit))
                    userVisits.value[tUser.id].days[d] = visit.status_visit

                    if (visit.status_visit) userVisits.value[tUser.id].counter += 1
                }
            }
        })
    })

}


async function getUserCompetitionsCurrentUser() {
    await competitionsStore.getAllUserCompetitions(
        {user_ids: [permissions_store.user_id]}
    ).then((res: IUser[]) => {
        uCompetitionsCurrent.value = res[0].user_competition ?? []
        uCompetitionsCurrent.value.forEach((el) => {
            if (el.competition?.date_start && el.competition?.date_end) {
                const dS = new Date(el.competition.date_start)
                const dE = new Date(el.competition.date_end)
                const per = datesCompetInPercents(dS, dE)
                sumCompVisitsPercents.value += per
            }
        })
    })
}

async function fetchUserStandards() {
    let usrIds = Object.keys(userVisits.value).map(Number);

    // console.log(props.semester.semester, semester.value.semester)
    const uS: ISearchStandardDto = {
        user_ids: usrIds,
        semestersRange: [props.semester.semester - 1, props.semester.semester],
        team_id: props.teamId,
    }

    const usersStandards: IUser[] = await competitionsStore.getUserStandards(uS)

    const standards: IDictionary[] = standardsNames.value

    const dataStandard: IUserAvgPoints = {}

    // go throught each user
    usersStandards.forEach((user) => {
        let sumPointsStart = 0
        let sumPointsEnd = 0
        const userId = user?.id

        if (userId) {
            dataStandard[userId] = {avgStart: 0, avgEnd: 0}

            // in each standard
            standards.forEach((standard) => {

                // go throught each user value standard
                user?.standard_user?.forEach((userStandard) => {

                    if (standard.id == userStandard.standard?.id && userStandard?.semester && userStandard.value) {
                        // console.log(user.fullname, "userStandard val ", userStandard.value, "sem ", userStandard?.semester, "semester.value", semester.value?.semester )
                        // start
                        if (userStandard?.semester < props.semester?.semester) {
                            sumPointsStart += convertValueToPoint(standard.name, userStandard.value)
                            // end
                        } else {
                            sumPointsEnd += convertValueToPoint(standard.name, userStandard.value)
                        }
                    }
                })
            })
            // console.log("end", sumPointsStart, sumPointsEnd)
            dataStandard[userId].avgStart = sumPointsStart / standards.length
            dataStandard[userId].avgEnd = sumPointsEnd / standards.length
        }
    })

    standardsAvgPoints.value = dataStandard
}

function datesCompetInPercents(dateStart: Date, dateEnd: Date) {
    let t = dateEnd.getTime() - dateStart.getTime()
    let days = t / (1000 * 60 * 60 * 24)
    // in percents +1 (include start date)
    return (days + 1) * 3
}

async function fetchNamesStandards() {
    standardsNames.value = await dictStore.getFromDictionaryByClassID(8)
}

</script>

<style lang="scss" scoped>
h3 {
  color: #959595;
}

.checkbox-custom {
  display: inline-block;
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.3rem;
  background-color: var(--second-color-50);

  &:hover {
    cursor: pointer;
    background-color: #b9e6e9;
  }

  &::before {
    content: "";
    display: block;
    width: 1.5rem;
    height: 1.5rem;
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
