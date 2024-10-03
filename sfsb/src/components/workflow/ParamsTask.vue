<template lang="pug">
    v-menu.menu(
        v-model="menu"
        :close-on-content-click="false"
        location="end"
        scroll-strategy="reposition"
        min-width="300px"
    )
        v-card.pa-2()
            h3.menu__header {{task.name}}
            v-form
                v-text-field(label="Описание" v-model.lazy="task.description")
                SetTime(v-model:start-at="localTask.startAt" v-model:end-at="localTask.endAt")
                RepalceToResource(v-model:resourceId="localTask.workflowId")
            .d-flex.justify-center
                v-btn-group
                    v-btn.flex-grow-1(color="orange-darken-1" @click="onTaskChange") Изменить
                    v-btn.flex-grow-1(color="grey-lighten-3" @click="menu=false") Отмена
</template>

<script setup lang="ts">
import { type ModelRef, ref, toRefs, watch } from "vue";
import SetTime from "@/components/workflow/SetTime.vue";
import RepalceToResource from "@/components/workflow/RepalceToResource.vue";

const menu = defineModel<boolean>("menu");
const task: ModelRef<Task, string> = defineModel<Task>("task", {
    required: true,
});
const emit = defineEmits(["change"]);

const { startAt, endAt } = toRefs(task.value);
const localTask = ref<Task>({ ...task.value } as Task);

const onTaskChange = () => {
    emit("change", localTask.value);
    menu.value = false;
};

watch([startAt, endAt], () => {
    console.log("время изменилось");
    localTask.value = { ...task.value };
});
</script>

<style scoped lang="sass">
.menu
    &__header
        text-align: center
</style>
