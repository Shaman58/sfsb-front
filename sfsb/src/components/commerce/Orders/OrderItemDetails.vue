<template lang="pug">
    v-form.order-item-details(v-if="currentItem" v-model="valid" )
        v-text-field.order-item-details__schema-number(label="Децимальный номер:"
            v-model="drawingNumber"
            placeholder="42"
            :rules="[rules.required]"
        )
        v-text-field.order-item-details__schema-name(label="Название чертежа:"
            v-model="drawingName"
            placeholder="Гайка M10"
            :rules="[rules.required]"
        )
        v-text-field.order-item-details__schema-amount(label="Количество:"
            v-model="quantity"
            type="number"
            placeholder="100"
            :rules="[rules.required]"
        )
        v-switch.order-item-details__outsource-material(v-model="customerMaterial",
            :label="customerMaterial ? 'Материал заказчика' : 'Наш материал'")

</template>
<script setup lang="ts">
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {computed, onUnmounted, ref, toRefs, watch} from "vue";

const currentItem = defineModel<Item>("item")
const props = defineProps<{ save: boolean }>()
const {save} = toRefs(props)

const {rules} = useValidationRules()
const valid = ref()

defineExpose({valid})

// const drawingNumber = ref(currentItem.value?.technology.drawingNumber)
const drawingNumber = computed({
    get() {
        return currentItem.value?.technology.drawingNumber
    },
    set(x?: string) {
        currentItem.value &&
        (currentItem.value.technology.drawingNumber = x || "")
    }
})
// const drawingName = ref(currentItem.value?.technology.drawingName)
const drawingName = computed({
    get() {
        return currentItem.value?.technology.drawingName
    },
    set(x?: string) {
        currentItem.value &&
        (currentItem.value.technology.drawingName = x || "")
    }
})
// const quantity = ref(currentItem.value?.quantity)
const quantity = computed({
    get() {
        return currentItem.value?.quantity || 0
    },
    set(x: number) {
        currentItem.value &&
        (currentItem.value.quantity = x )
    }
})
// const customerMaterial = ref(currentItem.value?.customerMaterial)
const customerMaterial = computed({
    get() {
        return currentItem.value?.customerMaterial || false
    },
    set(x: boolean) {
        currentItem.value &&
        (currentItem.value.customerMaterial = x )
    }
})

const unwatch = watch([save], () => {
    currentItem.value && (currentItem.value.technology.drawingNumber = drawingNumber.value || "")
    currentItem.value && (currentItem.value.technology.drawingName = drawingName.value || "")
    currentItem.value && (currentItem.value.quantity = quantity.value || 0)
    currentItem.value && (currentItem.value.customerMaterial = customerMaterial.value || false)
})

const unwatchCurrentItem = watch([currentItem], () => {
    drawingNumber.value = currentItem.value?.technology.drawingNumber
    drawingName.value = currentItem.value?.technology.drawingName
    quantity.value = currentItem.value?.quantity || 0
    customerMaterial.value = currentItem.value?.customerMaterial || false
}, {deep: true})


onUnmounted(() => {
    unwatch()
    unwatchCurrentItem()
})
</script>


<style scoped lang="sass">

</style>
