<template>
    <ModalFull :modal-id="modalId">
        <template #header> Редактировать семестры</template>

        <template #body>

            <div v-if="semestersStore.apiRequest.message || semestersStore.apiRequest.error" class="alert alert-warning"
                 role="alert">
                {{ semestersStore.apiRequest.message }} {{ semestersStore.apiRequest.error }}
            </div>

            <!--     time   -->
            <div v-if="mode == Mode.EDIT" class="mb-3">
                <label class="form-label">Семестр</label>
                <select class="form-select"
                        v-model="selectedSemester">
                    <option v-for="(val, index) in foundSemesters" v-bind:key="index" :value="val">
                        Семестр {{ val.value }}
                    </option>
                </select>
            </div>

            <!--   create new -->
            <div  v-if="mode == Mode.CREATE" class=" my-2">
                <input type="number" v-model="selectedSemester.value" />

            </div>
            <!--  semester  set dates -->
            <div class="row g-2 my-2">
                <div class="col-auto">
                    <div class="form-label">Дата начала</div>
                    <VueDatePicker :enable-time-picker="false" v-model="selectedSemester.date_start"/>
                </div>
                <div class="col-auto">
                    <div class="form-label">Дата окончания</div>
                    <VueDatePicker :enable-time-picker="false" v-model="selectedSemester.date_end"/>
                </div>

                <div class="row g-2 justify-content-end mt-4">
                    <!--   Создать новый-->
                    <div class="col-auto" v-if="mode == Mode.EDIT">
                        <button
                                class="btn-custom-primary"
                                @click="mode = Mode.CREATE"
                        >
                            Создать новый
                        </button>
                    </div>
                    <!--    Редактировать -->

                    <div class="col-auto" v-if="mode == Mode.CREATE">
                        <button
                                class="btn-custom-primary"
                                @click="mode = Mode.EDIT"
                        >
                            Редактировать
                        </button>
                    </div>
                    <div class="col-auto">
                        <button
                                class="btn-custom-accept"
                                @click="updateCreateSemester()"
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>


        </template>

    </ModalFull>
</template>

<script setup lang="ts">
import ModalFull from "@/components/modals/ModalFull.vue";
import {onBeforeMount, ref, watch} from "vue";
import {useSemesterStore} from "@/store/schedule/semesters_store";
import type {ICreatSemester} from "@/store/models/schedule/semester.model";
import {ISemester} from "@/store/models/schedule/semester.model";
import {Mode} from "@/store/enums/enum-mode";

const props = defineProps<{
    modalId: string;
}>();

const selectedSemester = ref<ISemester>({});
const semestersStore = useSemesterStore();

const date = ref(new Date());
const dateStart = ref(new Date())
const dateEnd = ref(new Date());

const foundSemesters = ref<ISemester[]>();

const mode = ref(Mode.EDIT);

onBeforeMount(() => {
    getSemesters()
});


const user = ref();

watch(selectedSemester.value, (value) => {
})

async function getSemesters() {
    foundSemesters.value = await semestersStore.getSemesters({});
    selectedSemester.value = (foundSemesters.value)[0]
}

async function updateCreateSemester() {
    const editingSemester: ICreatSemester = {
        ...selectedSemester.value
    };

    await semestersStore.createUpdateSemester(editingSemester)
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
