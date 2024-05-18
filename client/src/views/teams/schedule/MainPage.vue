<template>
    <!--    calendar-->
    <div class="my-4">

        <div class="row">
            <div class="col-auto">
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
            <template v-if="can('can create teams')">
                <div class="col justify-content-end align-items-center d-flex">
                    <b class="mx-3">Задать число посещений за семестр: </b><input v-model="maxVisits" type="number"/>
                </div>
                <div class="col-auto">
                    <button type="button" class=" btn-custom-accept" @click="setMaxVisits()">Сохранить</button>
                </div>
            </template>
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
    <!--  user  competitions-->
    <div class="row" v-if="!can('can edit own teams')">
        <UserCompetitions :team-id="teamId" :user-id="permissions_store.user_id"/>
    </div>
    <!--  visits-->
    <div class="row">
        <TeamVisits :dates="dates" :team-id="teamId" :maxVisits="team.max_visits ?? 0"  :is-national="isNational"/>
    </div>
    <!-- standard user -->
    <div class="row" v-if="!can('can edit own teams')">
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
import UserCompetitions from "@/views/teams/schedule/UserCompetitions.vue";
import TeamVisits from "@/views/teams/schedule/TeamVisits.vue";
import StandardUser from "@/views/teams/schedule/StandardUser.vue";

const props = defineProps<{
    teamId: number;
    isNational:boolean
}>();

const permissions_store = usePermissionsStore();
const teamStore = useTeamStore();

const can = permissions_store.can;

const selectedWeekStart = ref(getMonday(new Date())); // Используем функцию для получения понедельника
const maxVisits = ref(0); // Используем функцию для получения понедельника
const team = ref<ITeam>({}); // Используем функцию для получения понедельника

onBeforeMount(() => {
    getTeam()
})

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
