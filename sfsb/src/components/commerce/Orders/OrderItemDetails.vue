<template lang="pug">
    .order-item-details(v-if="currentItem")
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
import {onUnmounted, ref, toRefs, watch, watchEffect} from "vue";

const currentItem = defineModel<Item>("item")
const props = defineProps<{save: boolean}>()
const {save} = toRefs(props)

const {rules} = useValidationRules()

const drawingNumber = ref(currentItem.value?.technology.drawingNumber)
const drawingName = ref(currentItem.value?.technology.drawingName)
const quantity = ref(currentItem.value?.quantity)
const customerMaterial = ref(currentItem.value?.customerMaterial)

const unwatch = watch([save],()=>{
    currentItem.value && (currentItem.value.technology.drawingNumber = drawingNumber.value||"")
    currentItem.value && (currentItem.value.technology.drawingName = drawingName.value||"")
    currentItem.value && (currentItem.value.quantity = quantity.value||0)
    currentItem.value && (currentItem.value.customerMaterial = customerMaterial.value||false)
})

const unwatchCurrentItem = watch([currentItem],()=>{
     drawingNumber.value = currentItem.value?.technology.drawingNumber
     drawingName.value = currentItem.value?.technology.drawingName
     quantity.value = currentItem.value?.quantity
     customerMaterial.value = currentItem.value?.customerMaterial
},{deep: true})

watchEffect(()=> {
    if(!currentItem.value || !currentItem.value.technology) return
    currentItem.value.technology.drawingNumber = drawingNumber.value||""
})
watchEffect(()=> {
    if(!currentItem.value || !currentItem.value.technology) return
    currentItem.value.technology.drawingName = drawingName.value||""
})
watchEffect(()=> {
    if(!currentItem.value ) return
    currentItem.value.quantity = quantity.value||0
})
watchEffect(()=> {
    if(!currentItem.value ) return
    currentItem.value.customerMaterial = customerMaterial.value||false
})

onUnmounted(() => {
    unwatch()
    unwatchCurrentItem()
})
</script>


<style scoped lang="sass">

</style>
