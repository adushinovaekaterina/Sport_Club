<template>
    <ModalFull :modal-id="modalId">
        <template #header> Редактировать расписание</template>

        <template #body>

            <div v-if="cabinetsStore.apiRequest.message || cabinetsStore.apiRequest.error" class="alert alert-warning"
                 role="alert">
                {{ cabinetsStore.apiRequest.message }} {{ cabinetsStore.apiRequest.error }}
            </div>
            <div>
                <div class="fw-bold">Аудитория:</div>
                <v-select
                        placeholder="Аудитория"
                        class="v-select"
                        label="name"
                        :options="foundAuditories"
                        v-model="selectedCabinet"
                ></v-select>
            </div>
            <!--     time   -->
            <div class="row g-2 my-2 d-flex justify-content-center text-center">
                <div class="col-12">
                    <div class="form-label">Дата</div>
                    <DatePicker mode="date" v-model="date" hide-time-header/>
                </div>
                <div class="col-auto">
                    <div class="form-label">Дата начала</div>
                    <DatePicker mode="time" v-model="timeStart"/>
                </div>
                <div class="col-auto">
                    <div class="form-label">Дата окончания</div>
                    <DatePicker mode="time" v-model="timeEnd"/>
                </div>
            </div>

            <div class="row g-2 justify-content-end mt-4">
                <div class="col-auto">
                    <button
                            class="btn-custom-accept"
                            @click="saveChanges()"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </template>

    </ModalFull>
</template>

<script setup lang="ts">
import ModalFull from "@/components/modals/ModalFull.vue";
import {onBeforeMount, ref, watch} from "vue";
import {DatePicker} from "v-calendar";
import {useCabinetsTimeStore} from "@/store/schedule/cabinets-time_store";
import type {ICabinetsTimeEdit} from "@/store/models/schedule/cabinets-time.model";
import {clone} from "lodash";
import {useAuditoriesStore} from "@/store/schedule/cabinets_store";
import type {ICabinet} from "@/store/models/schedule/cabinet.model";
import {ISemester} from "@/store/models/schedule/semester.model";

const props = defineProps<{
    teamId: number; //задать id user
    scheduleId: number;
    modalId: string;
    onSaveChanges: () => void;
    semester: ISemester,

}>();

const cabinetsStore = useCabinetsTimeStore();
const auditoryStore = useAuditoriesStore();

const date = ref(new Date());
const timeStart = ref(date.value)
const timeEnd = ref(date.value);

const foundAuditories = ref<ICabinet[]>([]);
const selectedCabinet = ref<ICabinet>();

onBeforeMount(() => {
    date.value.setMinutes(0)
    date.value.setSeconds(0)
    editTimeCabinet.value.id_team_schedule = props.scheduleId

    getAuditories()
});


const user = ref();
const responseMsg = ref("");

const editTimeCabinet = ref<ICabinetsTimeEdit>({});

watch(date, (value) => {

    const tS = clone(value)
    const tE = clone(value)

    tS.setHours(timeStart.value.getHours())
    tE.setHours(timeEnd.value.getHours())

    tS.setMinutes(timeStart.value.getMinutes())
    tE.setMinutes(timeEnd.value.getMinutes())

    timeStart.value = tS
    timeEnd.value = tE
})

watch(
    () => props.scheduleId,
    async () => {
        editTimeCabinet.value.id_team_schedule = props.scheduleId
    },
);

async function getAuditories() {
    let r = await auditoryStore.getCabinets({});
    foundAuditories.value = r.cabinets;
}

async function saveChanges() {
    await addTime()
}

async function addTime() {
    const eTimeCab =  editTimeCabinet.value
    eTimeCab.repeat = true
    eTimeCab.date = date.value
    eTimeCab.id_cabinet = selectedCabinet.value?.id
    eTimeCab.team_id= props.teamId
    eTimeCab.semester_id= props.semester.id

    eTimeCab.time_start = timeStart.value.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
    eTimeCab.time_end = timeEnd.value.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })

    await cabinetsStore
        .setCabinetsTime(eTimeCab)
        .then(async () => {
            props.onSaveChanges();
        })
        .catch((err) => {
            responseMsg.value = err;
        });
}

</script>

<style lang="scss" scoped>
.create-perm {
  border: var(--main-border-card);
  border-radius: 50px;
  overflow: hidden;

  input {
    border: none;

    &:hover, &:focus, &:active {
      border: none;
      box-shadow: none;
    }
  }
}
</style>
