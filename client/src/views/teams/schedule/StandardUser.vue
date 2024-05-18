<template>
    <h6 class="fw-bold my-4">НОРМАТИВЫ</h6>
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
                <tr v-for="el in standardsALL" :key="el.standard.class_id">
                    <td>{{ el.standard.name }}</td>
                    <td v-if="!can('can edit own teams')">{{ el.userStandard.value }}</td>
                    <td v-else>
                        <input type="number" :value="el.userStandard.value"
                               @change="(e)=>changeValue(e, el.standard.id ?? -1)"/></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts" setup>

import type {Ref} from "vue";
import {onBeforeMount, ref, watch} from "vue";
import {useTeamStore} from "@/store/team_store";
import type {ITeam} from "@/store/models/teams/team.model";
import {usePermissionsStore} from "@/store/permissions_store";
import type {ICreateStandardDto, IStandardUser} from "@/store/models/competition/standard-user.model";
import {useCompetitionStore} from "@/store/competition/competition_store";
import {useDictionaryStore} from "@/store/dictionary_store";
import type {IDictionary} from "@/store/models/dictionary/dictionary.model";

const competitionsStore = useCompetitionStore();
const dictStore = useDictionaryStore();
const permissions_store = usePermissionsStore();
const teamStore = useTeamStore();

const can = permissions_store.can;

const props = defineProps<{
    teamId: number,
    userId: number,
}>();

const team: Ref<ITeam> = ref({});
const updateUS: Ref<ICreateStandardDto> = ref({});
const standardsNames: Ref<IDictionary[]> = ref([]);
const changedValue = ref<number>();

const standardsALL = ref<{ standard: IDictionary, userStandard: IStandardUser }[]>([]);

onBeforeMount(async () => {
    await fetchNamesStandards()
    await fetchUserStandards();
});


watch(
    () => props.userId,
    async (value) => {
        if (value) {
            await fetchUserStandards();
        }
    },
);

async function fetchUserStandards() {
    const data = await competitionsStore.getUserStandards({user_id: props.userId});
    const userStandards: IStandardUser[] = data
    const standards: IDictionary[] = standardsNames.value
    const standardsCombined: { standard: IDictionary, userStandard: IStandardUser }[] = []

    standards.forEach((el) => {
        let foundedStandard: IStandardUser = {}
        userStandards.forEach((uS) => {
            if (el.id == uS.standard?.id) {
                foundedStandard = uS
            }
        })
        standardsCombined.push({standard: el, userStandard: foundedStandard})
    })
    standardsALL.value = standardsCombined

}

async function fetchNamesStandards() {
    const data = await dictStore.getFromDictionaryByClassID(8)
    standardsNames.value = data
}

async function changeValue(e: any, standardId: number) {
    changedValue.value = Number(e.target?.value)
    updateUS.value = {user_id: props.userId, value: changedValue.value, standard_id: standardId, team_id: props.teamId}
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
  min-width: 120px; /* Adjust the number of columns here */

  height: 80px;

  text-align: center; /* Center-align horizontally */
  vertical-align: middle; /* Vertical centering */
}
</style>

