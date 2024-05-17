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
                <tr v-for="el in userStandards" :key="el.id">
                    <td>{{ el.standard?.name }}</td>
                    <td>{{ el.value }}</td>
                    <td></td>
                </tr>
                </tbody>
            </table>
            <div v-if="!userStandards || userStandards.length <= 0" class="">
                <div class="alert alert-danger" role="alert">
                    Данных нет
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import type {Ref} from "vue";
import {onBeforeMount, ref, watch} from "vue";
import {useTeamStore} from "@/store/team_store";
import type {ITeam} from "@/store/models/teams/team.model";
import {usePermissionsStore} from "@/store/permissions_store";
import type {IStandardUser} from "@/store/models/competition/standard-user.model";
import {useCompetitionStore} from "@/store/competition/competition_store";

const competitionsStore = useCompetitionStore();
const permissions_store = usePermissionsStore();
const teamStore = useTeamStore();

const can = permissions_store.can;

const props = defineProps<{
    teamId: number,
}>();

const team: Ref<ITeam> = ref({});

const userStandards = ref<IStandardUser[]>([]);

onBeforeMount(async () => {
    await fetchUserStandards();
});


async function fetchUserStandards() {
    const data = await competitionsStore.getUserStandards({user_id: permissions_store.user_id});
    userStandards.value = data
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

