<template lang="pug">
    v-dialog(max-width="500")
        template(v-slot:activator="{ props: activatorProps }")
            v-btn(
                v-bind="activatorProps"
                color="surface-variant"
                text="Добавить ресурс"
                variant="flat")

        template(v-slot:default="{ isActive }")
            v-card(title="Добавление ресурса")
                v-form.form
                    v-text-field(v-model="name" label="Название")

                    v-select(
                        v-model="operations"
                        clearable
                        chips
                        label="Технология"
                        :items="items"
                        multiple)

                v-card-actions
                    v-spacer

                    v-btn(text="Добавить" color="orange" @click="onAdd(isActive)")
                    v-btn(text="Закрыть" @click="isActive.value = false")
</template>

<script setup lang="ts">
import { type Ref, ref, watchEffect } from "vue";
import { useOrdersInWorkflow } from "@/pinia-store/ordersInWorkflow";
import { useWorkflow } from "@/pinia-store/workflow";

const props = defineProps<{ items: string[] }>();
const name = ref("");
const operations = ref<string[]>([]);

const { add } = useOrdersInWorkflow();
const { getResources } = useWorkflow();

const onAdd = async (isActive: Ref<boolean>) => {
    isActive.value = false;
    await add({
        name: name.value,
        operations: [...operations.value],
    });
    await getResources();
};

watchEffect(() => {
    console.log(operations.value);
});
</script>
<style scoped lang="sass">
.form
    margin: 1rem
</style>
