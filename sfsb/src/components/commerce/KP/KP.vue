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
                v-list-item
                    div Сортировать:
                    .sort-controls
                        SortControl(
                            v-model:asc="asc"
                            v-model:criterion="criterion"
                            :items="criteria"
                            item-title="title"
                            item-value="parameter"
                        )
                v-list-item(v-for="(i, idx) in sortedKP"
                    :key="i.id"
                    :active="+page===i.id"

                )
                    v-list-item-title
                        router-link.list-link(:to="`/commerce/kp/${i.id}`") {{"#"+i.id}} №{{i.applicationNumber}} {{new Date(i.created).toLocaleDateString()}}
                v-list-item(v-intersect="next" :style="{minHeight: '4px !important'}")
        template(#card)
            router-view(#default="{Component, route}")
                transition(name="fade")
                    div.transition-div(:key="route.params" :data-route="route.params.id")
                        component(:is="Component")
</template>
<script setup lang="ts">

import LayoutPage from "@/components/common/LayoutPage.vue";
import {storeToRefs} from "pinia";
import {useKPStore} from "@/pinia-store/kp";
import {computed, onUnmounted, ref, toRefs, watch, watchEffect} from "vue";
import {useRoute, useRouter} from "vue-router";
import SortControl from "@/components/common/SortControl.vue";

const filterText = ref("")
const {loading, kp} = storeToRefs(useKPStore())
const {fetch, next: nextKP} = useKPStore()
!kp.value.length && await fetch()

const router = useRouter()
const route = useRoute();
const {path} = toRefs(route);
const page = computed(() => path.value.split("/").at(-1))

const asc = ref<boolean>(true)
watchEffect(() => console.log("asc", asc.value))

const criteria = [
    {parameter: "id", title: "id"},
    {parameter: "applicationNumber", title: "Номер предложения"},
    {parameter: "created", title: "Дата"},
    {parameter: "managerUuid", title: "Автор"},
] as const

type ParameterType = typeof criteria[number]["parameter"]
const criterion = ref<ParameterType>("id")

const sortedKP = computed(() => {
    if (criterion.value === "created") {
        const res = kp.value.sort((a, b) => {
            const parsedA = Date.parse((a.created || "0").toLocaleString())
            const parsedB = Date.parse((b.created || "0").toLocaleString())
            return !!asc.value
                ? parsedA - parsedB
                : parsedB - parsedA
        })
        console.log(res)
        return res
    }
    //@ts-ignore
    return kp.value.sort((a, b) => !!asc.value ? a[criterion.value] - b[criterion.value] : b[criterion.value] - a[criterion.value])
})

const next = async (ev: Event) => {
    if (!ev) return
    await nextKP()
}

const unwatchRoute = watch([route], () => {
    if (route.params.id) return
    router.push("/commerce/kp/" + kp.value[0].id)
}, {immediate: true})

onUnmounted(() => {
    unwatchRoute()
})
</script>


<style scoped lang="sass">
.fade-enter-active, .fade-leave-active
    transition: all 0.5s ease

.fade-enter-from, .fade-leave-to
    opacity: 0
    translate: 50% 0

</style>
