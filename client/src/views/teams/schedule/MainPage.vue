<template>
    <!--    calendar-->
    <div class="my-4">
        <!--   Задать число посещений за семестр -->
        <div class="row" v-if="can('can create teams')">
            <div class="col  align-items-end d-flex">
                <div class="mb-3">
                    <label class="form-label">Задать число посещений за семестр:</label>
                    <input v-model="maxVisits" type="number"/>
                    <button type="button" class=" btn-custom-accept mx-2" @click="setMaxVisits()">Сохранить</button>
                </div>
            </div>

            <!--  Семестр -->
            <div class="col-auto">
                <label class="form-label">Семестр</label>
                <select class="form-select"
                        v-model="selectedSemester">
                    <option v-for="(val, index) in foundSemesters" v-bind:key="index" :value="val">
                        Семестр {{ val.value }}
                    </option>
                </select>
            </div>

            <!--  calendar -->
            <div class="col-auto">
                <div class="mb-3">
                    <label class="form-label">Дата </label>
                    <DropdownBtn>
                        <template #img>
                            <FontAwesomeIcon icon="calendar"/>
                        </template>
                        <template #title>{{ selectedWeekStart.toLocaleDateString() }}</template>
                        <template #body>
                            <DatePicker v-model="selectedWeekStart"/>
                        </template>
                    </DropdownBtn>
                </div>
            </div>
        </div>

    </div>
    <!--    buttons-->
    <div class="row  mt-5">
        <div class="col-12">
            <div class="d-flex justify-content-between mb-3">
                <button @click="prevWeek" class="btn-custom-neutral">
                    <FontAwesomeIcon icon="chevron-left" class="me-3"/>
                    Предыдущая неделя
                </button>
                <h4 class="text-center">{{ dates.formattedDate }}</h4>
                <button @click="nextWeek" class="btn-custom-neutral">
                    Следующая неделя
                    <FontAwesomeIcon class="ms-3" icon="chevron-right"/>
                </button>
            </div>
        </div>
    </div>

    <!-- schedule-->
    <div class="row my-3">
        <TeamSchedule :dates="dates" :team-id="teamId"/>
    </div>
    <!-- if its member of team-->
    <!--  user  competitions-->
    <div v-if="currUserFunctions == TeamRoles.Member && !isNational" class="row">
        <UserCompetitions :team-id="teamId" :user-id="permissions_store.user_id"/>
    </div>
    <!-- visits-->
    <div class="row"
         v-if="can('can edit own teams') || currUserFunctions == TeamRoles.Member || currUserFunctions == TeamRoles.Leader">
        <TeamVisits :dates="dates" :team-id="teamId" :maxVisits="team.max_visits ?? 0" :is-national="isNational"
                    :semester="selectedSemester"/>
    </div>
    <!-- standard user -->
    <div class="row" v-if="currUserFunctions == TeamRoles.Member">
        <StandardUser :team-id="teamId" :user-id="permissions_store.user_id"/>
    </div>

</template>

<script lang="ts" setup>
import {getFormattedWeek, getMonday,} from "@/views/teams/schedule/format-date";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {computed, onBeforeMount, ref} from "vue";
import {DatePicker} from "v-calendar";
import DropdownBtn from "@/components/Buttons/DropdownBtn.vue";
import {useTeamStore} from "@/store/team_store";
import type {ITeam} from "@/store/models/teams/team.model";
import {usePermissionsStore} from "@/store/permissions_store";
import TeamSchedule from "@/views/teams/schedule/TeamSchedule.vue";
import UserCompetitions from "@/views/teams/progress/UserCompetitions.vue";
import TeamVisits from "@/views/teams/schedule/TeamVisits.vue";
import StandardUser from "@/views/teams/progress/StandardUser.vue";
import {TeamRoles} from "@/store/enums/team_roles";
import {semesters} from "@/store/constants/other";
import {ISemester} from "@/store/models/schedule/semester.model";
import {useSemesterStore} from "@/store/schedule/semesters_store";

const props = defineProps<{
    teamId: number;
    isNational: boolean;
    currUserFunctions: TeamRoles | undefined;
}>();

const permissions_store = usePermissionsStore();
const teamStore = useTeamStore();
const semestersStore = useSemesterStore();

const can = permissions_store.can;

const selectedWeekStart = ref(getMonday(new Date())); // Используем функцию для получения понедельника
const maxVisits = ref(0); // Используем функцию для получения понедельника
const team = ref<ITeam>({}); // Используем функцию для получения понедельника

const selectedSemester = ref<ISemester>({});
const foundSemesters = ref<ISemester[]>([]);

onBeforeMount(() => {
    getTeam()
    getSemesters()
})

async function getSemesters() {
    foundSemesters.value = await semestersStore.getSemesters({});
    selectedSemester.value = (foundSemesters.value)[0]
}

const weekDays = computed(() => {
    const days: Date[] = [];
    const startDate = new Date(selectedWeekStart.value);
    for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        days.push(day);
    }
    return days;
});

const dates = computed(() => {
    return getFormattedWeek(
        weekDays.value[0],
        weekDays.value[weekDays.value.length - 1],
    );
});

async function setMaxVisits() {
    const res = await teamStore.setMaxVisits(props.teamId, maxVisits.value).then(async () => {
        await getTeam()
    })
}

async function getTeam() {
    team.value = await teamStore.fetchTeam(props.teamId)
    maxVisits.value = team.value.max_visits ?? 0
}


function prevWeek() {
    selectedWeekStart.value = new Date(
        selectedWeekStart.value.getTime() - 7 * 24 * 60 * 60 * 1000,
    );
}

function nextWeek() {
    selectedWeekStart.value = new Date(
        selectedWeekStart.value.getTime() + 7 * 24 * 60 * 60 * 1000,
    );
}

</script>

<style lang="scss" scoped>

h3 {
  color: #959595;
}
</style>
