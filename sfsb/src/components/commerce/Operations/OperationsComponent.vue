<template lang="pug">
    LayoutPage
        template(#title) Операции
        template(#filter)
            v-text-field(label="фильтр" v-model="filterText")
        template(#list)
            v-list
                v-list-item
                    v-list-item-title
                        router-link(:to="`/commerce/operations/new`")
                            span(style="{color: 'orange'}") Добавить новую операцию
                v-list-item(v-for="i in operations" @click="currentOperation=i"
                    :key="i.id" :active="+page===i.id")
                    v-list-item-title
                        router-link(:to="`/commerce/operations/${i.id}`") {{i.operationName}}
        template(#card)
            router-view
            //ClientCard(:company="currentCompany" :loading)

</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {computed, onMounted, ref, toRefs, watchEffect} from "vue";
import LayoutPage from "@/components/common/LayoutPage.vue";
import {useRoute, useRouter} from "vue-router";
import {useOperationsStore} from "@/pinia-store/operations";

const router = useRouter()

const route = useRoute();
const {path} = toRefs(route);
const page = computed(() => path.value.split("/").at(-1))


const {operations, loading} = storeToRefs(useOperationsStore())
const {fetchOperation} = useOperationsStore()


const filterText = ref("")
const currentOperation = ref<Operation>(operations.value[0])

onMounted(async () => {
    !operations.value.length && await fetchOperation()
    const firstId = computed(() => operations.value.length && operations.value[0].id)
    page.value === "operations" && await router.push(`/commerce/operations/${firstId.value}`)

})

watchEffect(() => {
    console.log("loading", loading)
})
</script>
<style scoped lang="sass">

</style>
