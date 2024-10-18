<template lang="pug">
    v-dialog(max-width="500")
        template(v-slot:activator="{ props: activatorProps }")
            v-btn(
                v-bind="activatorProps"
                color="surface-variant"
                text="Добавить технологию"
                variant="flat")

        template(v-slot:default="{ isActive }")
            v-card.card(title="Добавление технологии")
                v-form.form
                    v-text-field(v-model="technologyName" label="Название")

                    .selected
                        v-text-field(v-model="currentName" label="Название")
                        v-select(
                            v-model="currentOperation"
                            label="Технология"
                            :items="operations"
                        )
                        v-icon(@click="addSelectedItem" icon="mdi-plus-circle-outline")
                ul.list
                    li.item(v-for="(item, index) in selectedItems" :key="index")
                        v-icon(@click="removeSelectedItem(item)" icon="$close")
                        span {{ item.name}}
                        span {{ item.operation}}


                v-card-actions
                    v-spacer

                    v-btn(text="Добавить" color="orange" @click="onAdd(isActive)")
                    v-btn(text="Закрыть" @click="isActive.value = false")
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useOrdersInWorkflow } from "@/pinia-store/ordersInWorkflow";
import { onMounted, type Ref, ref } from "vue";
import { useToast } from "vue-toast-notification";
import { useWorkflow } from "@/pinia-store/workflow";

const toast = useToast();

const { operations } = storeToRefs(useOrdersInWorkflow());
const { getOperations } = useOrdersInWorkflow();
const { addTaskManual, getResources } = useWorkflow();

const technologyName = ref("");

const currentOperation = ref("");
const currentName = ref("");

const selectedItems: Ref<{ name: string; operation: string }[]> = ref([]);

const onAdd = async (isActive: Ref<boolean>) => {
    if (!technologyName.value)
        return toast.error("Вы забыли назвать технологию");
    const res: CreateManualTechnology = {
        name: technologyName.value,
        tasks: selectedItems.value,
    };
    await addTaskManual(res);
    isActive.value = false;
    await getResources();
};

const addSelectedItem = () => {
    if (!currentName.value || !currentOperation.value)
        return toast.error("Не все поля заполнены");
    const item = {
        name: currentName.value,
        operation: currentOperation.value,
    };
    selectedItems.value.push(item);
    currentOperation.value = "";
    currentName.value = "";
};

const removeSelectedItem = (item: { name: string; operation: string }) => {
    selectedItems.value = selectedItems.value.filter(
        (e) => e.name !== item.name && e.operation !== item.operation
    );
};

onMounted(async () => {
    if (!operations.value.length) {
        await getOperations();
    }
});
</script>

<style scoped lang="sass">
.selected, .item, .v-list-item__content
    display: flex
    align-items: center
    gap: 1rem

.list
    height: 150px
    overflow-y: auto
    border-radius: 12px
    border: 1px solid #ccc

.item
    padding: 0.5rem

    &:nth-child(odd)
        background: #ccc


.card
    padding: 0.5rem
</style>
