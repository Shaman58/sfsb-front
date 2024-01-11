<template lang="pug">
.item-card(:data-type="type" :data-calculated="isComputed && isMaterial")
    .item-card__info(v-if="!editing")
        .item-card__indicators
            v-icon(v-if="type!=='new'" :color="isComputed?'green':'grey'") mdi-alarm-panel-outline
            v-icon(v-if="type!=='new'" :color="isMaterial?'green':'grey'") mdi-flask-empty
        .item-card__name(@click="editing=true") {{type==="new" ? "добавить новый" : itemLocal.technology.drawingNumber}} {{type==="new" ? "" :itemLocal.technology.drawingName}}
        .item-card__amount(v-if="type!=='new'" @click="editing=true") {{itemLocal.quantity}} шт.
        .item-card__controls
            v-icon(@click="editing=true"  v-if="type!=='new'" icon="mdi-pencil" color="blue")
            v-icon(@click="emit('remove')" v-if="type!=='new'" icon="mdi-close" color="red")
    .item-card__details(v-if="editing")
        .item-card__details-date
            v-text-field.item-card__schema-number(label="Номер чертежа:" v-model="itemLocal.technology.drawingNumber" :disabled="!!itemLocal.technology?.id")
            v-text-field.item-card__schema-name(label="Название чертежа:" v-model="itemLocal.technology.drawingName" :disabled="!!itemLocal.technology?.id")
            v-text-field.item-card__schema-amount(label="Количество:" v-model="itemLocal.quantity" type="number")
        .item-card__details-controls
            v-switch.item-card__outsource-material(v-model="itemLocal.customerMaterial", :label="itemLocal.customerMaterial ? 'Материал заказчика' : 'Наш материал'")
            .item-card__change(@click="save") {{type==="new" ? 'Добавить' : 'Изменить' }}
            .item-card__close(@click="editing=false") Закрыть
</template>

<script setup lang="ts">
import {computed, ref, watch, watchEffect} from "vue";

const {item, type} = defineProps<{item: Item, type?: "new"}>()
const emit = defineEmits(["save", "remove"])

const editing = ref(false)
const itemLocal = ref(item)

const isComputed = computed(()=>!!itemLocal.value?.technology?.computed)
const isMaterial = computed(()=>!!itemLocal.value?.customerMaterial || !!itemLocal.value?.technology?.assembly || !!itemLocal.value.technology?.workpiece?.material?.price?.amount)

const save=()=>{
    emit('save', {...itemLocal.value})
    editing.value=false
}

const newItem = ()=> {
    return ({ technology: { outsourcedCosts: { amount: 0, currency: 'RUB' }}, customerMaterial:false, uid: Date.now() } as Item)
}

watch([editing],()=>{
    if(type!=="new") return
    editing.value && (itemLocal.value = newItem())
})

watchEffect(()=>console.log(itemLocal.value))
</script>

<style scoped lang="sass">
.item-card
    width: 100%
    padding: 1rem
    border-radius: 4px
    background: #eeea

    &[data-calculated="true"]
        background-color: #00e67630
        border: 1px solid #00e676
    &:not([data-calculated="true"])
        border: 1px solid #c62828

    &[data-type="new"]
        background-color: #eee
        border: 1px solid transparent
        text-transform: uppercase

        .item-card__info
            grid-template-columns: 1fr
            place-items: center
            cursor: pointer

    &__info
        display: grid
        grid-template-columns: 1fr 3fr 2fr 1fr

    &__name, &__amount
        cursor: pointer

    &__amount
        display: flex
        justify-content: center

    &__controls
        display: flex
        justify-content: flex-end

    &__details-date
        display: flex
        align-items: center
        gap: 1rem

        & > *
            flex: 1 1 100%


    &__details-controls
        display: flex
        align-items: center
        gap: 1rem

        & > *
            cursor: pointer
</style>
