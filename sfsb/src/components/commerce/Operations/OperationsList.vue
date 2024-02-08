<template lang="pug">
    v-list
        v-list-item
            v-list-item-title
                router-link.list-link(:to="`/commerce/operations/new`")
                    span(:style="{color: 'orange'}") Добавить новую операцию
        v-list-item
            v-list-item-title
                router-link.list-link(:to="`/commerce/operations/setup`") Наладочная
        v-list-item
            v-list-item-title
                router-link.list-link(:to="`/commerce/operations/tech`") Технолог
        v-list-item(v-for="i in operations" @click="currentOperation=i"
            :key="i.id" :active="+page===i.id")
            v-list-item-title
                router-link.list-link(:to="`/commerce/operations/${i.id}`") {{i.operationName}}
</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useOperationsStore} from "@/pinia-store/operations";
import {computed, ref, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";

const router = useRouter()

const route = useRoute();
const {path} = toRefs(route);
const page = computed(() => path.value.split("/").at(-1))

const {operations, loading, techPrice, setupPrice} = storeToRefs(useOperationsStore())
const {fetchOperation, fetchSetupPrice, fetchTechPrice} = useOperationsStore()

const currentOperation = ref<Operation>(operations.value[0])

!operations.value.length && await fetchOperation()
!Object.keys(techPrice.value).length && await fetchTechPrice()
!Object.keys(setupPrice.value).length && await fetchSetupPrice()


const firstId = computed(() => operations.value.length && operations.value[0].id)
page.value === "operations" && await router.push(`/commerce/operations/${firstId.value}`)
</script>


<style scoped lang="sass">

</style>
