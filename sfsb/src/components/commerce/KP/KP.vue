<template lang="pug">
    LayoutPage
        template(#title) Коммерческие предложения
        template(#filter)
            v-text-field(label="фильтр" v-model="filterText" clearable)
        template(#list)
            v-list
                v-list-item
                    v-list-item-title
                        router-link.list-link(:to="`/commerce/kp/new`")
                            div(:style="{color: 'orange'}") Добавить новое КП
                v-list-item(v-for="i in kp"
                    :key="i.id"
                    :active="+page===i.id")
                    v-list-item-title
                        router-link.list-link(:to="`/commerce/kp/${i.id}`") {{"#"+i.id}} №{{i.applicationNumber}} {{new Date(i.created).toLocaleDateString()}}
        template(#card)
            router-view
</template>
<script setup lang="ts">

import LayoutPage from "@/components/common/LayoutPage.vue";
import {storeToRefs} from "pinia";
import {useKPStore} from "@/pinia-store/kp";
import {computed, onUnmounted, ref, toRefs, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const filterText = ref("")
const {loading, kp} = storeToRefs(useKPStore())
const {fetch} = useKPStore()
!kp.value.length && await fetch()

const router = useRouter()
const route = useRoute();
const {path} = toRefs(route);
const page = computed(() => path.value.split("/").at(-1))

const unwatchRoute = watch([route],()=>{
    if(route.params.id) return
    router.push("/commerce/kp/"+kp.value[0].id)
},{immediate: true})

onUnmounted(()=>{
    unwatchRoute()
})
</script>


<style scoped lang="sass">

</style>
