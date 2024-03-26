<template>
  <div class="block-content border-block">
    <div class="row mb-4">
      <div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 border-1 border-end">
        <div class="wrapper-navigation">
          <div class="row">
<!--            <template v-for="(item, index) in itemList" :key="index">-->
<!--              <div class="col-xl-12 col-lg-auto col-sm-auto col-md-auto mb-3 nav-item">-->

                <div v-if="can('can view reports teams')" class="col-xl-12 col-lg-auto col-sm-auto col-md-auto mb-3 nav-item">
                  <div @click="setSelectItem(0)" :class="{ active: 0 == selectedItem }">
                    <span><font-awesome-icon :icon="['fas', itemList[0].icon]" /></span>
                    {{ itemList[0].name }}
                  </div>
                </div>
                <div v-if="can('can view directions')" class="col-xl-12 col-lg-auto col-sm-auto col-md-auto mb-3 nav-item">
                  <div @click="setSelectItem(1)" :class="{ active: 1 == selectedItem }">
                    <span><font-awesome-icon :icon="['fas', itemList[1].icon]" /></span>
                    {{ itemList[1].name }}
                  </div>
<!--                </div>-->

<!--                &lt;!&ndash; Проверка наличия разрешения перед отображением кнопки "Разрешения" &ndash;&gt;-->
<!--                <div v-if="can('can all')"-->
<!--                     class="col-xl-12 col-lg-auto col-sm-auto col-md-auto mb-3 nav-item">-->

<!--                  <a-->
<!--                      @click="setSelectItem(index)"-->
<!--                      :class="{ active: index == selectedItem }"-->
<!--                  >-->
<!--                  <span>-->
<!--                    <font-awesome-icon :icon="['fas', item.icon]"/>-->
<!--                  </span>-->
<!--                    {{ item.name }}</a-->
<!--                  >-->
<!--                </div>-->
<!--                <div v-else-->
<!--                     class="col-xl-12 col-lg-auto col-sm-auto col-md-auto mb-3 nav-item">-->

<!--                  <a-->
<!--                      @click="setSelectItem(index)"-->
<!--                      :class="{ active: index == selectedItem }"-->
<!--                  >-->
<!--                  <span>-->
<!--                    <font-awesome-icon :icon="['fas', item.icon]"/>-->
<!--                  </span>-->
<!--                    {{ item.name }}</a-->
<!--                  >-->
<!--                </div>-->

              </div>
<!--            </template>-->
          </div>
        </div>
      </div>
      <div class="col-xl-9 col-lg-9 col-md-12 col-sm-12">
        <div v-if="selectedItem == 0">
          <AdminTeams/>
        </div>

        <div v-if="selectedItem == 1">
<!--          <router-link to=""-->
          <AdminPermissions/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import AdminTeams from "@/views/admin_panel/AdminTeams.vue";
import AdminPermissions from "@/views/admin_panel/AdminPermissions.vue";
import {usePermissionsStore} from "@/store/permissions_store";

const selectedItem = ref(0);

const itemList = [
  {name: "Сборные команды / Команды по физкультуре", icon: "user-shield"},
  {name: "Разрешения", icon: "lock-open"},
];

const setSelectItem = (i: number) => {
  selectedItem.value = i;
};

const permissions_store = usePermissionsStore();
const can = permissions_store.can;
ref(permissions_store.isLogged);

onMounted(() => {
  if (can('can view reports teams')) {
    setSelectItem(0); // Выбор элемента с индексом 1 при наличии разрешения 'can view directions'
  } else if (can('can view directions')){
    setSelectItem(1); // Выбор элемента с индексом 0 при отсутствии разрешения 'can view directions'
  }
});

</script>

<style scoped lang="scss">
.block-content {
  padding: 30px;
  margin: 30px auto 30px auto;
  background: white;

  .wrapper-navigation {
    .nav-item {
      cursor: pointer;
    }

    .active {
      color: var(--main-color);
    }
  }
}
</style>
