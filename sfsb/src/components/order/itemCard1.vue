<template lang="pug">
.item-card(:data-type="type")
    .item-card__info(v-if="!editing")
        .item-card__indicators
            v-icon(v-if="type!=='new'") mdi-alarm-panel-outline
            v-icon(v-if="type!=='new'") mdi-flask-empty
        .item-card__name(@click="editing=true") {{type==="new" ? "добавить новый" : itemLocal.technology.drawingNumber}} {{type==="new" ? "" :itemLocal.technology.drawingName}}
        .item-card__amount(v-if="type!=='new'" @click="editing=true") {{itemLocal.quantity}} шт.
        .item-card__controls
            v-icon(@click="editing=true"  v-if="type!=='new'" icon="mdi-pencil")
            v-icon(@click="emit('remove')" v-if="type!=='new'" icon="mdi-close")
    .item-card__details(v-if="editing")
        .item-card__details-date
            v-text-field.item-card__schema-number(label="Номер чертежа:" v-model="itemLocal.technology.drawingNumber")
            v-text-field.item-card__schema-name(label="Название чертежа:" v-model="itemLocal.technology.drawingName")
            v-text-field.item-card__schema-amount(label="Количество:" v-model="itemLocal.quantity", type="number" )
        .item-card__details-controls
            v-switch.item-card__outsource-material(v-model="itemLocal.customerMaterial", :label="itemLocal.customerMaterial ? 'Материал заказчика' : 'Наш материал'")
            .item-card__change(@click="save") {{type==="new" ? 'Добавить' : 'Изменить' }}
            .item-card__close(@click="editing=false") Закрыть
</template>

<script setup lang="ts">
import {reactive, ref, toRaw, watch} from "vue";

const {item, type} = defineProps<{item: Item, type?: "new"}>()
const emit = defineEmits(["save", "remove"])

const editing = ref(false)
let itemLocal = reactive(item)

const save=()=>{
    emit('save', {...toRaw(itemLocal)})
    editing.value=false
}

const newItem = ()=> {
    // lastId.value++
    return ({ technology: { outsourcedCosts: { amount: 0, currency: 'RUB' }}, customerMaterial:false } as Item)
}

watch([editing],()=>{
    if(type!=="new") return
    editing.value && (itemLocal = reactive(newItem()))
})
</script>

<style scoped lang="sass">
.item-card
    width: 100%
    padding: 1rem
    border-radius: 4px
    background: #eeea

    &[data-type="new"]
        .item-card__info
            grid-template-columns: 1fr
            place-items: center
            cursor: pointer

    &__info
        display: grid
        grid-template-columns: 1fr 3fr 1fr 1fr

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
