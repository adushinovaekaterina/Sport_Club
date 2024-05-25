<template>
    <h6 class="fw-bold my-4">НОРМАТИВЫ</h6>
    <div class="row my-3 justify-content-end">
        <div class="col-auto">
            <div class="mb-3">
                <label class="form-label">Семестр</label>
                <select
                        class="form-select"
                        v-model="semester.selected"
                        @change="fetchUserStandards()"
                >
                    <option v-for="(val, index) in semesters" v-bind:key="index" :value="val">
                        {{ val.name }}
                    </option>
                </select>
            </div>
        </div>
    </div>


    <div class="row">
        <div class="col-12 overflow-scroll">
            <table class="table">
                <thead>
                <tr>
                    <th class="header">Тест</th>
                    <th class="header">Значение</th>
                    <th class="header"> Кол-во баллов</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(el, index) in standardsFound.selected" :key="el.standard.class_id">
                    <td>{{ el.standard.name }}</td>
                    <td v-if="can('can edit own teams')">
                        <input type="number" step="any" min="0" max="100" :value="el.userStandard.value"
                               @change="(e) => changeValue(e, el.standard.id ?? -1)"/>
                    </td>
                    <td v-else>
                        {{ el.userStandard.value }}
                    </td>
                    <td>
                        <!— Используем индекс строки для определения критериев —>
                        <template v-if="index === 0">
                            <!— Критерии для первой строки (сгибание и разгибание рук) —>
                            <span v-if="el.userStandard.value < 21">{{  1 }}</span>
                            <span v-else-if="el.userStandard.value >= 21 && el.userStandard.value <= 25">{{
                                     2
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 26 && el.userStandard.value <= 38">{{
                                     3
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 39 && el.userStandard.value <= 43">{{
                                    4
                                }}</span>
                            <span v-else-if="el.userStandard.value > 43">{{  5 }}</span>
                        </template>
                        <template v-else-if="index === 1">
                            <!— Критерии для второй строки (поднимание туловища из положения лежа) —>
                            <span v-if="el.userStandard.value < 25">{{ 1 }}</span>
                            <span v-else-if="el.userStandard.value >= 25 && el.userStandard.value <= 33">{{
                                   2
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 34 && el.userStandard.value <= 46">{{
                                  3
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 46 && el.userStandard.value <= 47">{{
                                   4
                                }}</span>
                            <span v-else-if="el.userStandard.value > 47">{{  5 }}</span>
                        </template>
                        <template v-else-if="index === 2">
                            <!— Критерии для третьей строки (наклон вперед) —>
                            <span v-if="el.userStandard.value < 5">{{ 1 }}</span>
                            <span v-else-if="el.userStandard.value >= 5 && el.userStandard.value <= 7">{{
                                    2
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 8 && el.userStandard.value <= 10">{{
                                   3
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 11 && el.userStandard.value <= 15">{{
                                    4
                                }}</span>
                            <span v-else-if="el.userStandard.value > 16">{{ 5 }}</span>
                        </template>
                        <template v-else-if="index === 3">
                            <!— Критерии для четвертой строки (прыжок в длину с места) —>
                            <span v-if="el.userStandard.value < 133">{{  1 }}</span>
                            <span v-else-if="el.userStandard.value >= 133 && el.userStandard.value <= 143">{{
                                    2
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 144 && el.userStandard.value <= 170">{{
                                     3
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 171 && el.userStandard.value <= 182">{{
                                    4
                                }}</span>
                            <span v-else-if="el.userStandard.value > 182">{{ 5 }}</span>
                        </template>
                        <template v-else-if="index === 4">
                            <!— Критерии для пятой строки (челночный бег) —>
                            <span v-if="el.userStandard.value > 23.2">{{  1 }}</span>
                            <span v-else-if="el.userStandard.value >= 22.3 && el.userStandard.value <= 23.2">{{
                                     2
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 20.1 && el.userStandard.value <= 22.2">{{
                                  3
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 19.0 && el.userStandard.value <= 20.0">{{
                                    4
                                }}</span>
                            <span v-else-if="el.userStandard.value < 19.0">{{  5 }}</span>
                        </template>
                        <template v-else-if="index === 5">
                            <!— Критерии для шестой строки (бег 100 м) —>
                            <span v-if="el.userStandard.value > 18.0">{{  1 }}</span>
                            <span v-else-if="el.userStandard.value >= 17.6 && el.userStandard.value <= 18.0">{{
                                    2
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 17.1 && el.userStandard.value <= 17.5">{{
                                   3
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 16.6 && el.userStandard.value <= 17.0">{{
                                   4
                                }}</span>
                            <span v-else-if="el.userStandard.value <= 16.5">{{ 5 }}</span>
                        </template>
                        <template v-else-if="index === 6">
                            <!— Критерии для седьмой строки (бег 1000 м) —>
                            <span v-if="el.userStandard.value
> 8.21">{{1 }}</span>
                            <span v-else-if="el.userStandard.value >= 7.29 && el.userStandard.value <= 8.23">{{
                                     2
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 5.37 && el.userStandard.value <= 7.28">{{
                                    3
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 4.01 && el.userStandard.value <= 5.36">{{
                                   4
                                }}</span>
                            <span v-else-if="el.userStandard.value < 4.01">{{  5 }}</span>
                        </template>
                        <template v-else-if="index === 7">
                            <!— Критерии для восьмой строки (бег 2000 м) —>
                            <span v-if="el.userStandard.value > 14.00">{{  1 }}</span>
                            <span v-else-if="el.userStandard.value >= 13.11 && el.userStandard.value <= 14.00">{{
                                    2
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 12.31 && el.userStandard.value <= 13.10">{{
                                   3
                                }}</span>
                            <span v-else-if="el.userStandard.value >= 10.50 && el.userStandard.value <= 12.30">{{
                                     4
                                }}</span>
                            <span v-else-if="el.userStandard.value < 10.50">{{  5 }}</span>
                        </template>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" class="fw-bold">Итого среднее арифметическое:</td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="row">
        <!--        {{graphics.standard}}-->

        <!--        semester  {{semester}}-->
        <ELine title="Динамика физической подготовленности студента" :legend="['dd', 'dde']"
               :series="graphics.standard.series"
               :x-axis="graphics.standard.xAxis"/>
    </div>

</template>

<script lang="ts" setup>

import type {Ref} from "vue";
import {onBeforeMount, ref, watch} from "vue";
import {useTeamStore} from "@/store/team_store";
import type {ITeam} from "@/store/models/teams/team.model";
import {usePermissionsStore} from "@/store/permissions_store";
import type {
    ICreateStandardDto,
    ISearchStandardDto,
    IStandardUser
} from "@/store/models/competition/standard-user.model";
import {useCompetitionStore} from "@/store/competition/competition_store";
import {useDictionaryStore} from "@/store/dictionary_store";
import type {IDictionary} from "@/store/models/dictionary/dictionary.model";
import ELine from "@/components/charts/ELine.vue";
import type {ISeriesLine} from "@/store/models/other";
import {convertValueToPoint} from "@/views/teams/progress/standardUser";

const competitionsStore = useCompetitionStore();
const dictStore = useDictionaryStore();
const permissions_store = usePermissionsStore();
const teamStore = useTeamStore();

const can = permissions_store.can;

const props = defineProps<{
    teamId: number,
    userId: number,
}>();

const semesters = [
    {id: 0, name: "1 семестр (начало)", start: true, value: 0.5},
    {id: 1, name: "1 семестр (конец) ", start: false, value: 1},
    {id: 2, name: "2 семестр (начало)", start: true, value: 1.5},
    {id: 3, name: "2 семестр (конец)", start: false, value: 2},
    {id: 4, name: "3 семестр (начало)", start: true, value: 2.5},
    {id: 5, name: "3 семестр (конец)", start: false, value: 3},
    {id: 6, name: "4 семестр (начало)", start: true, value: 3.5},
    {id: 7, name: "4 семестр (конец)", start: false, value: 4},
    {id: 8, name: "5 семестр (начало)", start: true, value: 4.5},
    {id: 9, name: "5 семестр (конец)", start: false, value: 5},

    {id: 10, name: "6 семестр (начало)", start: true, value: 5.5},
    {id: 11, name: "6 семестр (конец)", start: false, value: 6},
    {id: 12, name: "7 семестр (начало)", start: true, value: 6.5},
    {id: 13, name: "7 семестр (конец)", start: false, value: 7},
    {id: 14, name: "8 семестр (начало)", start: true, value: 7.5},
    {id: 15, name: "8 семестр (конец)", start: false, value: 8},
    {id: 16, name: "9 семестр (начало)", start: true, value: 8.5},
    {id: 17, name: "9 семестр (конец)", start: false, value: 9},
    {id: 18, name: "10 семестр (начало)", start: true, value: 9.5},
    {id: 19, name: "10 семестр (конец)", start: false, value: 10}];

const team: Ref<ITeam> = ref({});
const semester = ref({
    selected: semesters[0],
    start: semesters[0], end: semesters[1]
});
const updateUS: Ref<ICreateStandardDto> = ref({});
const standardsNames: Ref<IDictionary[]> = ref([]);
const changedValue = ref<number>();

const standardsFound = ref<{
    selected: {
        standard: IDictionary, userStandard: IStandardUser
    }[],
    startSem: {
        standard: IDictionary, userStandard: IStandardUser
    }[], endSem: {
        standard: IDictionary, userStandard: IStandardUser
    }[]
}>({selected: [], startSem: [], endSem: []});

// graphics
const graphics = ref<{
    // standard user graphic semesters
    standard: {
        legend: string[], series: ISeriesLine[], xAxis: string[]
    }
}>(
    {standard: {legend: [], series: [], xAxis: []}}
);

onBeforeMount(async () => {
    await fetchNamesStandards()
    await fetchUserStandards();
});

watch(
    () => semester.value.selected,
    async (value) => {
        if (value.start) {
            semester.value.start = value
            semester.value.end = semesters[value.id + 1]
        } else {
            semester.value.start = semesters[value.id - 1]
            semester.value.end = value
        }
    },
);


watch(
    () => props.userId,
    async (value) => {
        if (value) {
            await fetchUserStandards();
        }
    },
);

// fill data for standards graphic semesters
async function fillStandards() {
    const st = standardsFound.value
    const series: ISeriesLine[] = []
    // start semester
    const dataStandardS = new Array<number>(standardsNames.value.length).fill(0);
    // end semester
    const dataStandardE = new Array<number>(standardsNames.value.length).fill(0);

    // go through each standard
    standardsNames.value.forEach((el, index) => {
        // start semester
        st.startSem.forEach((stS) => {
            if (stS.userStandard.value && el.id == stS.userStandard?.standard?.id) {
                // add user result
                dataStandardS[index] = convertValueToPoint(el.name, stS.userStandard?.value)
            }
        })
        // end semester
        st.endSem.forEach((stE) => {
                if (stE.userStandard.value && el.id == stE.userStandard?.standard?.id) {
                    // add user result
                    dataStandardE[index] = convertValueToPoint(el.name, stE.userStandard?.value)
                }
            }
        )
    })

    series.push({type: "line", data: dataStandardS, name: "начало семестра"})
    series.push({type: "line", data: dataStandardE, name: "конец семестра"})

    graphics.value.standard.series = series
    graphics.value.standard.xAxis = standardsNames.value.map((el) => {
        return el.name
    })

    // averages
    dataStandardS.push(dataStandardS.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        / dataStandardS.length)
    dataStandardE.push(dataStandardE.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        / dataStandardE.length)
    graphics.value.standard.xAxis.push("ср. знач.")

}

async function fetchUserStandards() {

    const uS: ISearchStandardDto = {
        user_id: props.userId,
        semesters: [semester.value.start.value, semester.value.end.value],
        team_id: props.teamId,
    }

    const userStandards: IStandardUser[] = await competitionsStore.getUserStandards(uS)
    const standards: IDictionary[] = standardsNames.value
    const standardsCombined: {
        startSem: { standard: IDictionary, userStandard: IStandardUser }[],
        endSem: { standard: IDictionary, userStandard: IStandardUser }[]
    } = {startSem: [], endSem: []}

    standards.forEach((el) => {
        let foundedStandard: { start: IStandardUser, end: IStandardUser } = {start: {}, end: {}}
        userStandards.forEach((uS) => {
            if (el.id == uS.standard?.id) {
                // start
                if (uS.semester == semester.value.start.value) {
                    foundedStandard.start = uS
                    // end
                } else {
                    foundedStandard.end = uS
                }
            }

        })
        standardsCombined.startSem.push({standard: el, userStandard: foundedStandard.start})
        standardsCombined.endSem.push({standard: el, userStandard: foundedStandard.end})
    })

    // selected semester
    if (semester.value.selected.start) {
        standardsFound.value.selected = standardsCombined.startSem
    } else {
        standardsFound.value.selected = standardsCombined.endSem
    }

    standardsFound.value.startSem = standardsCombined.startSem
    standardsFound.value.endSem = standardsCombined.endSem

    // fill graphic
    await fillStandards()
}

async function fetchNamesStandards() {
    const data = await dictStore.getFromDictionaryByClassID(8)
    standardsNames.value = data
}

async function changeValue(e: any, standardId: number) {
    changedValue.value = Number(e.target?.value)
    updateUS.value = {
        user_id: props.userId,
        value: changedValue.value,
        standard_id: standardId,
        team_id: props.teamId,
        semester: semester.value.selected.value,
    }
    await updateCreateUserStandard()
}

async function updateCreateUserStandard() {
    const data = await competitionsStore.updateCreateUserStandard(updateUS.value).then(() => {
        fetchUserStandards()
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
  min-width: 120px;

  height: 80px;

  text-align: center;
  vertical-align: middle;
}
</style>

