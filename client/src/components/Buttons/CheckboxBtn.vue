<template>
    <label class="checkbox__container">
        <input
                type="checkbox"
                class="checkbox"
                @change="onChange"
                v-model="checked"
        />
        <span class="fake"></span>
        <span class="span__title">{{ title }}</span>
    </label>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

const props = defineProps<{
    title: string;
    isChecked: boolean;
    onChange: (checked: boolean) => void
}>();

const checked = ref(props.isChecked)

watch(
    () => props.isChecked,
    async (value) => {
      checked.value = props.isChecked
    },
);

function onChange() {
    props.onChange(checked.value)
}

</script>

<style scoped lang="scss">
.checkbox__title {
  color: #373737;
  margin-bottom: 0.5rem;
}

.checkbox__container {
  padding: 0.2rem 0.5rem;
  display: flex;

  &.hidden {
    display: none;
  }

  &:hover {
    cursor: pointer;
  }

  .checkbox {
    display: none;

    &:checked + .fake::before {
      opacity: 1;
    }
  }

  .span__title {
    color: #a1a1a1;
    font-size: 1rem;
    margin-left: 1rem;
    hyphens: manual;
    width: 50%;
  }

  .span__title-dark {
    color: #373737;
  }

  .fake {
    display: inline-block;
    position: relative;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.3rem;
    background-color: var(--second-color-50);

    &:hover {
      cursor: pointer;
      background-color: var(--second-color);
    }
  }

  .fake::before {
    content: "";
    position: absolute;
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    background-color: var(--second-color);
    background-image: url(@/assets/icon/checked.svg);
    border-radius: 0.3rem;
    transform: (-50%, -50%);
    opacity: 0;
    transition: 0.2s;
  }
}

</style>
