<template>
        <div class="col-12 overflow-scroll" style="max-height: 500px">
            <table class="table">
                <thead>
                <tr class="header">
                    <th class="p-2 bg-transparent">Название</th>
                    <th class="p-2  bg-transparent">Вид спорта</th>
                    <th class="p-2  bg-transparent">Уровень</th>
                    <th class="p-2  bg-transparent">Даты проведения</th>
                    <th class="p-2  bg-transparent">Результат</th>
                    <th class="p-2  bg-transparent">Проценты посещаемости</th>
                </tr>
                </thead>
                <tbody>

                <tr v-for="(el, index1) in uCompetitions" :key="index1" class="">
                    <td class="">{{ el.competition?.name }}</td>
                    <td class="">{{ el.competition?.sport_type }}</td>
                    <td class="">{{ el.competition?.level?.name }}</td>
                    <td class="">{{ new Date( el.competition?.date_start ).toLocaleDateString()}} - {{ new Date( el.competition?.date_end ).toLocaleDateString()}}</td>
                    <td class="">{{ el.result }}</td>
                    <td class="">{{percentVisits(new Date(el.competition?.date_start), new Date(el.competition?.date_end))}}</td>

                </tr>
                </tbody>
            </table>
            <div v-if="!uCompetitions || uCompetitions.length <= 0" class="">
                <div class="alert alert-danger" role="alert">
                    Данных нет
                </div>
            </div>
    </div>

</template>

<script lang="ts" setup>
import {onBeforeMount, ref} from "vue";
import {usePermissionsStore} from "@/store/permissions_store";

import type {IUserCompetition} from "@/store/models/competition/user-competition.model";
import {useCompetitionStore} from "@/store/competition/competition_store";

const competitionsStore = useCompetitionStore();
const permissions_store = usePermissionsStore();
const can = permissions_store.can;


const props = defineProps<{
    teamId: number;
}>();


const uCompetitions = ref<IUserCompetition[]>([]);

onBeforeMount(() => {
    getUserCompetitions()
});

async function getUserCompetitions() {
    await competitionsStore.getAllUserCompetitions(
        {user_id: permissions_store.user_id}
    ).then((res) => {
        uCompetitions.value = res
    })
}
function percentVisits(dateStart:Date, dateEnd:Date) {
    let t =  dateEnd.getTime() - dateStart.getTime()
    let days = t / (1000 * 60 * 60 *24)
    // in percents +1 (include start date)
    return (days + 1) * 3
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
  display: table-cell; /* Required for vertical centering */
}
</style>
