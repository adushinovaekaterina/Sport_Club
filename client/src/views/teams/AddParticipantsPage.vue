<template>
<!--    &lt;!&ndash;    go back &ndash;&gt;-->
<!--    <button class="btn-icon-rounded position-fixed start-0 btn-float mx-4" @click="goBack">-->
<!--        <font-awesome-icon :icon="['fas', 'arrow-left']" size="xl"/>-->
<!--        Назад-->
<!--    </button>-->
    <div class="border-block bg-white p-4">


        <div class="row">
            <!--    filters    -->
            <div class="col-md-3 col-12">
                <div class="nav-collapse collapse" id="collapseCkecker">
                    <div class="filters-block  border-1 border-end p-3">
                        <CheckBox_Menu
                                :menu_items="filters"
                                :handleEventSetFilters="handleEventSetFilters"
                                :handleEventResetFilters="handleEventResetFilters"
                        />
                    </div>
                </div>
            </div>

            <!--   users-->
            <div class="col-md-9 col-12">
                <h4 class="fw-bold">Добавление студентов в команду "{{ team.title }}" </h4>
                <div class="row">
                    <div class="col my-3">
                        <SearchField :handle-timer-search="handleTimerSearch"/>
                    </div>

                    <!-- фильтры в модальнос окне -->
                    <div class="col-auto align-items-center d-flex">
                        <div class="d-md-none">
                            <button
                                    type="button"
                                    class="btn-icon-rounded"
                                    data-bs-toggle="modal"
                                    data-bs-target="#filtersModal"
                            >
                                <font-awesome-icon class="ic fa-lg" icon="filter"/>
                            </button>
                        </div>

                        <ModalFull modal-id="filtersModal">
                            <template #header> Фильтры</template>
                            <template #body>
                                <CheckBox_Menu
                                        :menu_items="filters"
                                        :handleEventSetFilters="handleEventSetFilters"
                                        :handleEventResetFilters="handleEventResetFilters"
                                />
                            </template>
                        </ModalFull>
                    </div>
                </div>
                <div class="overflow-x-scroll">
                    <table class="table table-bordered fw-bold">
                        <thead>
                        <tr>
                            <th class="header">Студент</th>
<!--                            <th class="header">День рождения</th>-->
                            <th class="header">Группа</th>
                            <th class="header">Номер телефона</th>
                            <td></td>
                        </tr>
                        </thead>
                        <tbody>

                        <tr v-for="el in foundUsers.users" :key="el.id">
                            <td class="header">{{ el.fullname }}</td>
<!--                            <td>{{ el.birthdate }}</td>-->
                            <td>{{ el.education_group }}</td>
                            <td>{{ el.phone }}</td>
                            <td>
                                <!-- add new-->
                                <div v-if="!userInTeam(el.id ?? -1)">
                                    <button class="btn-primary-bordered"
                                            @click="addNewParticipant(el.id ?? -1)">Добавить
                                    </button>
                                </div>
                                <!-- already added-->
                                <div v-else class="justify-content-center align-items-center d-flex">
                                    <font-awesome-icon :icon="['fas', 'circle-check']" size="xl" class="text-success"/>
                                </div>
                            </td>
                          <td>
                            <!-- add new-->
                            <div v-if="userInTeam(el.id ?? -1)">
                              <button class="btn-primary-bordered"
                                      @click="deleteUserFromTeam(el.id ?? -1, Status.CANCELLED)">Удалить
                              </button>
                            </div>
                            <!-- already added-->
                            <div v-else class="justify-content-center align-items-center d-flex">
<!--                              <font-awesome-icon :icon="['fas', 'circle-check']" size="xl" class="text-success"/>-->
                            </div>
                          </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import type {IRUFunction} from "@/store/models/user/search-user-functions.model";
import {useTeamStore} from "@/store/team_store";
import type {ITeam} from "@/store/models/teams/team.model";
import {onBeforeMount, ref} from "vue";
import {usePermissionsStore} from "@/store/permissions_store";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/store/user_store";
import type {IUser} from "@/store/models/user/user.model";
import {FilterUser} from "@/store/models/user.model";
import SearchField from "@/components/SearchField.vue";
import type {IUserFunction} from "@/store/models/user/user-functions.model";
import type {IDictionary} from "@/store/models/dictionary/dictionary.model";
import {HEALTH_GROUP, INSTITUTE, STATE} from "@/store/constants/constants_class_names";
import {useDictionaryStore} from "@/store/dictionary_store";
import CheckBox_Menu from "@/components/CheckBoxMenu.vue";
import type {IMENU,} from "@/store/models/other";
import ModalFull from "@/components/modals/ModalFull.vue";
import {Status} from "@/store/enums/enum_event";
import type {RURequisition} from "@/store/models/teams/update-requisition.model";
import {useUserFunctionsStore} from "@/store/user_functions.store";

const router = useRouter();
const route = useRoute();
const teamId = Number(route.params.id);

const teamStore = useTeamStore();
const dictionaryStore = useDictionaryStore();

const team = ref<ITeam>({}); //коллектив
const teamUsers = ref<{ users: IUserFunction[], count: number }>({users: [], count: 0});
const foundUsers = ref<{ users: IUser[], count: number }>({users: [], count: 0});

const searchTxt = ref<string>("");

const permissions_store = usePermissionsStore();
const userStore = useUserStore();
const can = permissions_store.can;

const filters = ref<IMENU[]>([
    {
        id: 1,
        title: "Группа здоровья",
        hidden: false,
        menu_types: [],
    },
    {
        id: 2,
        title: "Институт",
        hidden: true,
        menu_types: [],
    },
    {
        id: 3,
        title: "Состояние",
        hidden: true,
        menu_types: [],
    },
    {
        id: 4,
        title: "Курс",
        hidden: true,
        menu_types: [],
    },
    {
        id: 5,
        title: "Пол",
        hidden: false,
        menu_types: [],
    },
]);


async function handleEventSetFilters() {
    await fetchUsers();
}

async function handleEventResetFilters() {
    await initDropdowns()
}

onBeforeMount(() => {
    fetchCurrentTeam()
    fetchUsersOfTeam()
    fetchUsers()
    initDropdowns()
})

//
// watch(
//     () => selectedUser.value.user,
//     async (value) => {
//         if (value) {
//             userId.value = selectedUser.value?.user.id ?? -1
//         }
//     },
// );


const initDropdowns = async () => {
    const initMenu = (index: number, dictionary: IDictionary[]) => {
        (filters.value)[index].menu_types = dictionary.map((el) => {
            return {id: el.id ?? -1, title: el.name ?? "", checked: false}
        })
    }
    // institutes
    let institutesD: IDictionary[] = await dictionaryStore.getFromDictionaryByClassID(INSTITUTE);
    // states
    let statesD: IDictionary[] = await dictionaryStore.getFromDictionaryByClassID(STATE);
    //healthGroup
    let healthGroupD: IDictionary[] = await dictionaryStore.getFromDictionaryByClassID(HEALTH_GROUP);

    initMenu(0, healthGroupD)
    initMenu(1, institutesD)
    initMenu(2, statesD)

    filters.value[3].menu_types = [
        {id: 1, title: "1", checked: false},
        {id: 2, title: "2", checked: false},
        {id: 3, title: "3", checked: false},
        {id: 4, title: "4", checked: false},
        {id: 5, title: "5", checked: false},
    ]

    filters.value[4].menu_types = [
        {id: 1, title: "женский", checked: false},
        {id: 2, title: "мужской", checked: false},
    ]

}

const handleTimerSearch = async (seachText: string) => {
    searchTxt.value = seachText;

    await fetchUsers();
}

const addNewParticipant = async (userId: number) => {
    await teamStore.assignNewParticipant(teamId, userId).then(async (res) => {
        await fetchUsersOfTeam();
    })
}

const userInTeam = (userId: number) => {
    let inTeam = false
    teamUsers.value.users.forEach((u) => {
        if (u.user?.id === userId) {
            inTeam = true
        }
    })

    return inTeam
}


async function fetchCurrentTeam() {
    teamStore.fetchTeam(teamId).then((respose) => {
        team.value = respose;
    });
}


const fetchUsersOfTeam = async () => {
    const data = await teamStore.fetchUsersOfTeam(teamId, {});
    teamUsers.value.users = data[0];
    teamUsers.value.count = data[1];
}

const goBack = () => {
    router.go(-1); // Navigate back to the previous page
};

const fetchUsers = async () => {
    let filterUser = new FilterUser();
    filterUser.limit = 10;
    filterUser.searchTxt = searchTxt.value;
    let fls = filters.value
    let healthGroups = fls[0].menu_types.filter(el => el.checked).map(el => el.id);
    let institutes = fls[1].menu_types.filter(el => el.checked).map(el => el.id);
    let states = fls[2].menu_types.filter(el => el.checked).map(el => el.id);
    let cources = fls[3].menu_types.filter(el => el.checked).map(el => el.id);
    let genders = fls[4].menu_types.filter(el => el.checked).map(el => el.title);

    filterUser.health_groups = healthGroups
    filterUser.institutes = institutes
    filterUser.states = states
    filterUser.courses = cources
    filterUser.genders = genders

    let r = await userStore.findUsers(filterUser);

    foundUsers.value.users = r.data[0];
    foundUsers.value.count = r.data[1];
}

const uFStore = useUserFunctionsStore();

const props = defineProps<{
  idTeam: number
  isNational: boolean
}>();

async function deleteUserFromTeam(userId: number, status_name: string) {
  let requis: RURequisition = {};
  requis.team_id = props.idTeam;
  requis.user_id = userId;

  // заявка меняет статус
  let requisitions = await teamStore.fetchRequisitions(requis);

  if (requisitions && requisitions[0]?.id) {
    let requis: RURequisition = {};
    requis.id = requisitions[0].id;
    requis.status_name = status_name;

    await teamStore.updateRequisition(requis);
  }

  // remove user functions
  let uFs = await uFStore.findUserFunctions(props.idTeam, userId);

  for (const uF of uFs) {
    // удалить роль в коллективе
    await uFStore.removeUserFunction(uF.id);
  }

  await fetchUsersOfTeam(); // благодаря этому обновляется в реальном времени
  await fetchUsers();  // Обновление списка всех найденных пользователей (Добавлено)
}

</script>

<style lang="scss" scoped>
.header {
  background: #e6e6e6;
}

.btn-float {
  top: 100px
}
</style>
