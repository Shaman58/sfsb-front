<template lang="pug">
    v-dialog(v-model="props.visible")
        v-card
            v-card-title
                v-row
                    v-col(cols="4")
                        v-text-field(label="Фильтр:" v-model="filter")
                    v-col
                        v-btn(color="orange-lighten-1" variant="text" @click.stop="setOperation(props.setupPrice)") Наладочная
                        //operation-create(:operation="setupPrice" :visible="active === 'setup'" @hide="active = -1" @save="save($event)" )
                    v-col
                        v-btn(color="orange-lighten-1" variant="text" @click.stop="setOperation(props.techPrice)") Технолог
                        //operation-create(:operation="techPrice" :visible="active === 'tech'" @hide="active = -1" @save="save($event)")
            v-list
                v-list-item(v-for="item in filtered" :key="item.id" :title="item.operationName" :subtitle="formatOperationData(item.operationTimeManagement)" @click.stop="setOperation(item)")
                    //operation-create(:operation="item" :visible="active === index" @hide="active = -1" @save="save($event)")

                v-list-item(:title="'...'")
                    template(#append)
                        v-btn(color="orange-lighten-1" icon="mdi-plus" variant="text" @click.stop="setOperation(emptyOperation)")
                    //operation-create(:operation="emptyOperation" :visible="active === 'new'" @hide="active = -1" @save="save($event)")

            v-card-actions
                v-spacer
                v-btn(color="orange-darken-1" variant="text" @click="hide") Закрыть

    OperationCreate( :operation="toOperation" :visible="showOperationCreate" @hide="clearOperation" @save="save($event)")
</template>

<script setup lang="ts">
import {computed, type ComputedRef, type Ref, ref} from "vue";
import useOperationFormatting from "@/mixins/OperationDataFormatting"
import OperationCreate from "@/components/operation/OperationCreate.vue";

interface Props {
    visible: boolean
    operations: Operation[] | null
    techPrice: Operation
    setupPrice: Operation
}

const props = defineProps<Props>();

const emit = defineEmits(["remove", "hide", "save"]);
const {formatOperationData} = useOperationFormatting();

const emptyOperation: Partial<Operation> = {paymentPerHour: {currency: 'RUB', amount: 0}}

const filter = ref("");
const active: Ref<null | string | number> = ref(null);

const toOperation: Ref<null | Partial<Operation>> = ref(null)
const showOperationCreate: Ref<boolean> = ref(false)
const setOperation = (operation: Partial<Operation>) => {
    showOperationCreate.value = true
    toOperation.value = operation
}


const clearOperation = () => {
    toOperation.value = emptyOperation
    showOperationCreate.value = false
}


const filtered: ComputedRef<Operation[]> = computed(() => {
    if (!props.operations) return []
    return props.operations.filter((item) => {
        return (
            (!filter.value || item.operationName.toLowerCase().includes(filter.value.toLowerCase()))
        );
    });
});

const remove = (data: Operation) => emit("remove", data);
const hide = () => emit("hide")
const save = (data: Operation) => emit("save", data)


</script>
