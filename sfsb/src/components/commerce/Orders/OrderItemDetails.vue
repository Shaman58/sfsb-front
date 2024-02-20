<template lang="pug">
    .order-item-details(v-if="currentItem")
        v-text-field.order-item-details__schema-number(label="Децимальный номер:"
            v-model="currentItem.technology.drawingNumber"
            placeholder="42"
            :rules="[rules.required]"
        )
        v-text-field.order-item-details__schema-name(label="Название чертежа:"
            v-model="currentItem.technology.drawingName"
            placeholder="Гайка M10"
            :rules="[rules.required]"
        )
        v-text-field.order-item-details__schema-amount(label="Количество:"
            v-model="currentItem.quantity"
            type="number"
            placeholder="100"
            :rules="[rules.required]"
        )
        v-switch.order-item-details__outsource-material(v-model="currentItem.customerMaterial",
            :label="currentItem.customerMaterial ? 'Материал заказчика' : 'Наш материал'")
</template>
<script setup lang="ts">
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {watch} from "vue";

const currentItem = defineModel<Item>("item")
const {rules} = useValidationRules()

watch(currentItem,console.log)
</script>


<style scoped lang="sass">

</style>
