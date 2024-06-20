<template>
    <!--    schedule-->
    <!--  time {{ time }} -->
    <!--  timeDayWeek {{ timeDayWeek }}-->

    <div class="row my-3">
        <div class="col-6">
            <button class="btn-primary" @click="downloadReportVisits">Выгрузить отчетность команды</button>
        </div>
        <div class="col-6 justify-content-end d-flex " v-if="can('can create teams')">
            <button class="btn-custom-primary" type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#editScheduleModal">Добавить занятие
                <FontAwesomeIcon icon="arrow-right"
                />
            </button>
        </div>
    </div>
    <div class="row">

        <div class="col-12 overflow-scroll" style="max-height: 500px">
            <table class="table">
                <thead>
                <tr class="header">
                    <th class="p-2 bg-transparent"></th>
                    <th
                            v-for="(date, index) in dates.dateRange"
                            v-bind:key="index"
                            class="p-2 bg-transparent"
                    >
                        <div class="text-center">{{ date.toLocaleDateString() }}</div>

<!--                        <div class="text-center">-->
<!--                            {{ dates.dateRange[index].getDate() }}-->
<!--                        </div>-->
                    </th>
                </tr>
                </thead>
                <tbody>
                <!--   hours-->
                <tr v-for="(hour, index1) in time" :key="index1" class="">
                    <td class="header fw-bold">{{ hour }}</td>
                    <!--  weeks-->
                    <td
                            v-for="(week, index2) in dates.weeks"
                            :key="index2"
                            class="p-0 position-relative week-cell"
                    >

                        <!--  data-->
                        <div v-if="timeDayWeek[week] && timeDayWeek[week][hour]">
                            <div
                                    v-for="(lesson, index3) in timeDayWeek[week][hour]"
                                    :key="index3"
                            >
                                <!--  DATA in cell-->
                                <div
                                        v-if="lesson.repeat || checkDatesYMDEquivalent(lesson.date,dates.dateRange[index2],)"
                                        class="selected-day p-1 position-relative"
                                >
                                    <!-- remove button-->
                                    <div class="position-absolute top-0 end-0 p-2" v-if="can('can create teams')">
                                        <div class="btn-remove mb-3" @click="deleteTime(lesson?.id)">
                                            <FontAwesomeIcon icon="xmark"/>
                                        </div>
                                    </div>
                                    <!--    info-->
                                    <p>{{ lesson?.cabinet?.name }}</p>
                                    <div class="">{{ lesson?.user?.fullname }}</div>
                                    <div>{{ lesson?.endTime }}</div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <div v-if="!time || time.length <= 0" class="">
                <div class="alert alert-danger" role="alert">
                    Время занятий не задано
                </div>
            </div>
        </div>
    </div>

    <!-- visits-->
    <div class="row"
         v-if="can('can edit own teams') || currUserFunctions == TeamRoles.Member || currUserFunctions == TeamRoles.Leader"
    >
        <TeamVisits :dates="dates" :team-id="teamId" :maxVisits="maxVisits" :is-national="isNational"
                    :semester="semester" :schedule="schedule" :timeDayWeek="timeDayWeek"/>
    </div>

    <ModalEditSchedule
            :is-edit-team="true"
            :team-id="teamId"
            :schedule-id="schedule.id ?? -1"
            modal-id="editScheduleModal" :on-save-changes="onSaveChangesModal"
            :semester="semester"
    />

</template>

<script lang="ts" setup>
import {useCabinetsTimeStore} from "@/store/schedule/cabinets-time_store";
import type {ICabinetsTimeSearch} from "@/store/models/schedule/cabinets-time.model";
import {onBeforeMount, ref, watch} from "vue";
import type {ISchedule} from "@/store/models/schedule/schedule.model";
import type {ICabinet} from "@/store/models/schedule/cabinet.model";
import type {IUser} from "@/store/models/user/user.model";
import {usePermissionsStore} from "@/store/permissions_store";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import ModalEditSchedule from "@/components/modals/ModalEditSchedule.vue";
import {ISemester} from "@/store/models/schedule/semester.model";
import {TeamRoles} from "@/store/enums/team_roles";
import TeamVisits from "@/views/teams/schedule/TeamVisits.vue";
import type {DayWeek} from "@/views/teams/schedule/day.model";
import {useUploadsStore} from "@/store/uploads_store";

const cabinetsStore = useCabinetsTimeStore();
const permissions_store = usePermissionsStore();
const uploadsStore = useUploadsStore();

const can = permissions_store.can;

const fileURL = ref(); //путь к файлу для загрузки
const cabinetsTimeStore = useCabinetsTimeStore();

const props = defineProps<{
    teamId: number;
    dates: {
        dateStart: Date;
        dateEnd: Date;
        dateRange: Date[];
        weeks: string[];
        formattedDate: string;
    };
    maxVisits: number,
    isNational: boolean,
    semester: ISemester,
    currUserFunctions: TeamRoles | undefined
}>();

const cabinetsTimeSearch = ref<ICabinetsTimeSearch>({team_id: props.teamId, semester_id: props.semester?.id});
const schedule = ref<ISchedule>({});
const timeDayWeek = ref<DayWeek>({});

const time = ref<string[]>([]);

onBeforeMount(() => {
    getCabinetsTime()
});

watch(() => props.semester, async (value) => {
    cabinetsTimeSearch.value.semester_id = value.id
    await getCabinetsTime()
})
const resFile = ref(); // файл

// скачать файл
async function downloadReportVisits() {
    const response = await uploadsStore
        .getReportTeamVisits({
            semester_id: props.semester.id,
            team_id: props.teamId,
        })
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'report-visits.xlsx'); // or any other extension
    document.body.appendChild(link);
    link.click();
    link.remove();
}

async function onSaveChangesModal() {
    await getCabinetsTime()
}


async function getCabinetsTime() {
    await cabinetsTimeStore.getCabinetsTime(
        cabinetsTimeSearch.value,
    ).then((res) => {
        schedule.value = res
        formatCabinetTime();
    })
}

async function formatCabinetTime() {
    time.value = []
    timeDayWeek.value = {}
    const cT = schedule.value.cabinets_time;
    cT?.forEach((el) => {
        const dayWeek = el.day_week?.name;
        const tStart = el.time_start;

        if (dayWeek) {
            // week date
            if (!timeDayWeek.value[dayWeek]) {
                timeDayWeek.value[dayWeek] = {};
            }

            // push time
            if (!timeDayWeek.value[dayWeek][tStart]) {
                timeDayWeek.value[dayWeek][tStart] = [];
            }

            if (!time.value.includes(tStart)) time.value.push(tStart);

            timeDayWeek.value[dayWeek][tStart].push({
                id: el.id,
                cabinet: el.cabinet ?? null,
                user: el.user ?? null,
                endTime: el.time_end,
                repeat: el.repeat,
                date: new Date(el.date),
            });
        }

    });

    //   sort time
    time.value.sort((a, b) => {
        const timeToSec = (time: string) => {
            const [hours, mins, sec] = time.split(":").map(Number);
            return hours * 3600 + mins * 60 + sec;
        };
        return timeToSec(a) - timeToSec(b);
    });
}

function checkDatesYMDEquivalent(date1: Date, date2: Date) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

async function deleteTime(id: number) {
    await cabinetsStore.deleteCabinetsTime(id).then(async () => {
        await getCabinetsTime()
    })
}

</script>

<style lang="scss" scoped>
.header {
  background: #e6e6e6;
}

th,
td {
  border: var(--main-border-card);
  min-width: 120px; /* Adjust the number of columns here */
  max-width: 120px;
  height: 80px;

  text-align: center; /* Center-align horizontally */
  vertical-align: middle; /* Vertical centering */
  display: table-cell; /* Required for vertical centering */
}

.selected-day {
  background: var(--second-color);
  color: white;
}

.week-cell {
  &:hover {
    .cell-settings {
      display: block;
    }
  }

  .cell-settings {
    display: none;
  }
}


.btn-remove {
  background: var(--dusk-color);
  border-radius: 5px;
  width: fit-content;
  padding: 2px 5px;
  opacity: 0.6;

  cursor: pointer;

  &:hover {
    transition: 0.3s;
    opacity: 1;
    background: var(--main-color);
  }
}
</style>
