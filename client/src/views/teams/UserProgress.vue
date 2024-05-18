<template>
    <button class="btn-icon-rounded position-fixed start-0 btn-float" @click="goBack"><font-awesome-icon :icon="['fas', 'arrow-left']" size="xl"/> Назад</button>
    <div class="border-block bg-white p-4">
        <UserCompetitions :team-id="teamId" :user-id="userId"/>
        <StandardUser :team-id="teamId" :user-id="userId"/>
    </div>
</template>

<script setup lang="ts">
import {useTeamStore} from "@/store/team_store";
import type {ITeam} from "@/store/models/teams/team.model";
import {ref} from "vue";
import {usePermissionsStore} from "@/store/permissions_store";
import {useRoute, useRouter} from "vue-router";
import StandardUser from "@/views/teams/schedule/StandardUser.vue";
import UserCompetitions from "@/views/teams/schedule/UserCompetitions.vue";

const route = useRoute();
const userId = Number(route.query.user_id)
const teamId = Number(route.params.id);

const teamStore = useTeamStore();

const team = ref<ITeam>({}); //коллектив

const permissions_store = usePermissionsStore();
const can = permissions_store.can;

const router = useRouter();

const goBack = () => {
    router.go(-1); // Navigate back to the previous page
};

</script>

<style lang="scss" scoped>
.btn-float{
  top:100px
}
</style>
