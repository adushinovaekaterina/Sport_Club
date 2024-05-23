<template>
<!--    go back -->
    <button class="btn-icon-rounded position-fixed start-0 btn-float mx-4" @click="goBack"><font-awesome-icon :icon="['fas', 'arrow-left']" size="xl"/> Назад</button>
    <div class="border-block bg-white p-4">
        <h2>ПРОГРЕСС</h2>
        <div class="row my-3">
            <div class="col-auto">
               <div class="my-2 fw-bold">Студент</div>
                <v-select
                        class="v-select"
                        label="data"
                        placeholder="ФИО пользователя или email"
                        @input="onTextChange"
                        :options="foundUsers"
                        v-model="selectedUser"
                ></v-select>
              </div>
            <div class="col"></div>
            <div class="col"></div>
        </div>

        <UserCompetitions :team-id="teamId" :user-id="userId"/>
        <StandardUser :team-id="teamId" :user-id="userId"/>
    </div>
</template>

<script setup lang="ts">
import {useTeamStore} from "@/store/team_store";
import type {ITeam} from "@/store/models/teams/team.model";
import { onBeforeMount, ref, onMounted, watch } from "vue"; // Добавлен импорт onMounted
// import {onBeforeMount, ref} from "vue";
import {usePermissionsStore} from "@/store/permissions_store";
import {useRoute, useRouter} from "vue-router";
import StandardUser from "@/views/teams/schedule/StandardUser.vue";
import UserCompetitions from "@/views/teams/schedule/UserCompetitions.vue";
import {useUserStore} from "@/store/user_store";
import type {IUser} from "@/store/models/user/user.model";
import {FilterUser} from "@/store/models/user.model";
import _ from "lodash";
// import {watch} from "vue";

const router = useRouter();
const route = useRoute();
const userId = ref(Number(route.query.user_id))
const teamId = Number(route.params.id);

const teamStore = useTeamStore();

const team = ref<ITeam>({}); //коллектив
const selectedUser = ref<{data: string, user:IUser}>({data:"", user:{}});
const foundUsers = ref<{data: string, user: IUser}[]>([]);

const permissions_store = usePermissionsStore();
const userStore = useUserStore();
const can = permissions_store.can;

const searchTxtUser = ref();

onBeforeMount(()=>{
    getUser()
    getUsers()
})

watch(
    () => selectedUser.value.user,
    async (value) => {
        if (value) {
            userId.value = selectedUser.value?.user.id ?? -1
        }
    },
);

const goBack = () => {
    router.go(-1); // Navigate back to the previous page
};

async function getUsers() {
    let filterUser = new FilterUser();
    filterUser.limit = 5;
    filterUser.searchTxt = searchTxtUser.value;
    let r = await useUserStore().findUsers(filterUser);

    //получить всех найденных юзеров
    let users:IUser[] = r.data[0];
    users.forEach((usr)=>{
        foundUsers.value.push({data:usr.fullname + ' ' + usr.education_group, user:usr})
    })
}

const getUser = async () => {
    const res = await userStore.getUser(userId.value)
    const user = res.data
    selectedUser.value = {data: user.fullname + ' ' +  user.education_group, user: user.value }
};

const timerFetchUsers = _.debounce(() => {
    getUsers();
}, 300);

async function onTextChange(e: InputEvent) {
    const el = e.target as HTMLInputElement;
    searchTxtUser.value = el.value;
    timerFetchUsers();
}

// Программная прокрутка к началу страницы при монтировании компонента
onMounted(() => {
  window.scrollTo(0, 0);
});

</script>

<style lang="scss" scoped>
.btn-float{
  top:100px
}
</style>
