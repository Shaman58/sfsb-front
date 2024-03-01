<template lang="pug">
    v-list.datapage-main__list
        v-list-item
            router-link(:to="href+'/new'") Добавить новый
        v-list-item(v-for="item in list" :key="item.id" :active="item.id+''===route.path.split('/').at(-1)" )
            router-link(:to="href+'/'+item.id")
                slot(:item="item")
        v-list-item(v-intersect="onInter")

</template>
<script setup lang="ts">
import {computed, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";

const props = defineProps<{ list: Material[] | Tool[] }>()
const {list} = toRefs(props)
const emit = defineEmits(["intersect"])

const route = useRoute()
const router = useRouter()

const href = computed(() => {
    const pathArr = route.path.split("/")
    const lastPathArr = pathArr.at(-1)
    if (!Number.isNaN(Number(lastPathArr)) || lastPathArr==="new") return pathArr.toSpliced(-1).join("/") //если последний элемент число или "new", то возвращаем строку без последнего элемента
    return route.path //иначе возвращаем path без изменений
})

const onInter=(ev: Event)=>{
    emit("intersect", ev)
}
</script>


<style scoped lang="sass">

</style>
