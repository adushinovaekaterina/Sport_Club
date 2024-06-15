<template>
    <!-- анкета -->
    <ModalQuestionnaireAnswers :form="currentRequisition"/>

    <div class="alert alert-danger" v-if="teamStore.apiRequest.error">
        {{ teamStore.apiRequest.error }}
    </div>

    <LoadingElem v-if="teamStore.apiRequest.loading" size-fa-icon=""/>

    <div class="row my-3">
        <div class="col-auto">
            <label class="form-label fw-bold">Статус</label>
            <select
                    class="form-select"
                    aria-label="Status"
                    v-model="selectedStatus"
                    @change="fetchRequisitions()"
            >
                <option v-for="st in statuses" :value="st" v-bind:key="st.id">
                    {{ st.name }}
                </option>
            </select>
        </div>
    </div>

    <!-- cards -->
    <div
            class="member-card border-block"
            v-for="(item, index) in requests"
            :key="index"
    >
        <div class="row">
            <!--            img-->
            <div class="col-2">
                <router-link
                        :to="{name:'Team', params:{id:item.team?.id} , query:{is_national:item.team?.is_national}}">

                    <img
                            v-if="item.team?.image && item.team.image?.length > 0"
                            :src="item.team?.image[0]"
                            class="d-block"
                            style="width: 100%; object-fit: cover"
                            alt=""
                    />
                    <img
                            v-else
                            src="@/assets/icon/empty_photo.jpg"
                            class="d-block"
                            style="width: 100%; object-fit: cover"
                            alt=""
                    />
                </router-link>
            </div>
            <div class="col">
                <router-link
                        :to="{name:'Team', params:{id:item.team?.id} , query:{is_national:item.team?.is_national}}">

                    <div class="row my-3 link">
                        <h4>{{ item.team?.title }}</h4>
                    </div>
                </router-link>

                <div class="row ">
                    <span>Дата последнего рассмотрения: {{ item.date_update }}</span>
                </div>
                <div class="row">
                    <span>Статус вашей заявки: <span :class="[item.status?.name == 'Принята' ? 'text-success' : 'text-danger', 'fw-bold']">
                         {{ item.status.name }}
                    </span>
                    </span>
                </div>
                <div class="row">
                    <span>Комментарий: {{ item.comment_leader ?? "-" }}</span>
                </div>
                <div class="row my-3 justify-content-end">
                    <div class="col-auto">
                        <button class="" @click="deleteRequisition(item.id ?? -1)">
                            Отозвать
                        </button>
                    </div>
                    <div class="col-auto">
                        <button
                                class="btn-custom-secondary px-4 "
                                data-bs-toggle="modal"
                                data-bs-target="#viewReqFormModal"
                                @click="setCurrentRequisition(item)"
                        >
                            Анкета
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import {onBeforeMount, ref, type Ref} from "vue";
import {type IRequisition} from "@/store/models/teams/requisition.model";
import {useTeamStore} from "@/store/team_store";
import {usePermissionsStore} from "@/store/permissions_store";
import LoadingElem from "@/components/LoadingElem.vue";
import ModalQuestionnaireAnswers from "@/components/modals/ModalQuestionnaireAnswers.vue";
import {useDictionaryStore} from "@/store/dictionary_store";
import type {IDictionary} from "@/store/models/dictionary/dictionary.model";

const requests: Ref<IRequisition[]> = ref([]);
const permissions_store = usePermissionsStore();

const dictStore = useDictionaryStore();
const teamStore = useTeamStore();

const currentRequisition = ref();
const selectedStatus = ref<IDictionary>();
const statuses = ref<IDictionary[]>([]);

onBeforeMount(() => {
    fetchStatuses().then(() => {
        fetchRequisitions();
    })
});

function setCurrentRequisition(req: IRequisition) {
    currentRequisition.value = req;
}

const fetchStatuses = async () => {
    statuses.value = await dictStore.getFromDictionaryByClassID(6)
    selectedStatus.value = statuses.value[1]
}

async function fetchRequisitions() {
    requests.value = await teamStore.getUserRequisitions(
        permissions_store.user_id,
        selectedStatus.value?.id
    );
}

async function deleteRequisition(requisId: number) {
    await teamStore.deleteRequisition(requisId);
    await fetchRequisitions()
}
</script>

<style scoped lang="scss">
.member-card {
  width: 100%;
  min-height: 200px;

  margin-bottom: 12px;
  background: #fff;
  padding: 20px;
  border-radius: var(--border-radius);
}
</style>
