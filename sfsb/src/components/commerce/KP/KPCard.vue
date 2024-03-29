<template lang="pug">
    LayoutMain
        template(#header)
            div(:style="{height:'10px', width:'100%'}")
                v-progress-linear(indeterminate v-if="loading")
            v-card(width="100%")
                v-card-actions
                    KPBar(
                        @save="saveKP"
                        @copy="copyKP"
                        @refresh="refresh"
                        @download="download"
                        @print="print"
                    )
                    //a(:href="objectURL" download="kp.docx") Скачать
        template(#default)
            v-card(v-if="currentKP")
                v-card-title
                    suspended-component
                        KPCardHeader(
                            :created="currentKP && currentKP.created"
                            :updated="currentKP && currentKP.updated"
                            :manager-uuid="currentKP && currentKP.managerUuid"
                            v-model:businessProposal="businessProposal"
                            v-model:applicationNumber="applicationNumber"
                            v-model:companyId="companyId"
                            v-model:customerId="customerId"
                        )
                v-card-text
                    v-text-field.py-0(
                        v-model="search"
                        label="Фильтр"
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        hide-details
                        single-line
                    )
                    suspended-component
                        KPItemsList(v-model:items="items" :search)

</template>

<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import {useKPStore} from "@/pinia-store/kp";
import {onBeforeUnmount, type Ref, ref, watch, watchEffect} from "vue";
import LayoutMain from "@/components/common/LayoutMain.vue";
import {storeToRefs} from "pinia";
import {Empty} from "@/mixins/Empty";
import KPItemsList from "@/components/commerce/KP/KPItemsList.vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import KPBar from "@/components/commerce/KP/KPBar.vue";
import {useCurrentUserStore} from "@/pinia-store/currentUser";
import KPCardHeader from "@/components/commerce/KP/KPCardHeader.vue";
import {useOfferGenerator} from "@/mixins/OfferGenerator";
import {saveAs} from "file-saver";

const router = useRouter()
const route = useRoute()
const {loading} = storeToRefs(useKPStore())
const {get, save} = useKPStore()

const currentKP: Ref<KP | null> = ref(null)
const items = ref<KPItem[]>([])


const objectURL = ref("")
const {generateDocument, printOffer} = useOfferGenerator()

const companyId = ref(currentKP.value?.companyId)
const customerId = ref(currentKP.value?.customerId)
watch([customerId], () => {
    console.log("customerId", customerId)
}, {immediate: true})
const businessProposal = ref(currentKP.value?.businessProposal)
const applicationNumber = ref(currentKP.value?.applicationNumber)

const unwatchCompanyId = watchEffect(() => currentKP.value && (currentKP.value.companyId = companyId?.value || 0))
const unwatchBusinessProposal = watchEffect(() => currentKP.value && (currentKP.value.businessProposal = businessProposal?.value || ""))
const unwatchApplicationNumber = watchEffect(() => currentKP.value && (currentKP.value.applicationNumber = applicationNumber?.value || 0))

const search = ref("")

//--- CURRENT USER ---
const {user} = storeToRefs(useCurrentUserStore())

const init = async () => {
    console.log(route.params)
    if (!Number.isNaN(Number(+route.params.id))) {
        currentKP.value = (await get<KP>(+route.params.id)) || null
    }
    if (route.params.id === "new" && !route.params?.clone) {
        currentKP.value = Empty.KP()
        currentKP.value.items = [Empty.KPItem()]
        user.value && (currentKP.value.managerUuid = user.value.id)
    }
    if (route.params.id === "new" && route.params?.clone) {
        if (Number.isNaN(+route.params?.clone)) {
            currentKP.value = Empty.KP()
            user.value && (currentKP.value.managerUuid = user.value.id)
            return
        }
        currentKP.value = (await get<KP>(+route.params.clone)) || null
        user.value && currentKP.value && (currentKP.value.managerUuid = user.value.id)
        currentKP.value && (currentKP.value.applicationNumber = -1)
    }
    items.value = currentKP.value?.items || [] as KPItem[]
    companyId.value = currentKP.value?.companyId
    customerId.value = currentKP.value?.customerId
    businessProposal.value = currentKP.value?.businessProposal
    applicationNumber.value = currentKP.value?.applicationNumber

}

const saveKP = async () => {
    const businessProposal = currentKP.value?.businessProposal || ""
    const applicationNumber = currentKP.value?.applicationNumber || 0
    const managerUuid = currentKP.value?.managerUuid || user.value?.id || ""
    const res = await save({
        ...currentKP.value,
        businessProposal,
        applicationNumber,
        companyId: companyId.value || 0,
        customerId: customerId.value || 0,
        managerUuid,
        items: items.value
    })
    console.log("res after save", res)
}

const copyKP = () => {
    console.log("copy")
    router.push("/commerce/kp/new/" + currentKP.value?.id)
}

const refresh = async () => {
    await init()
}

//--- WATCH ---
const unwatchRoute = watch([route], init, {immediate: true})

const download = async () => {
    const {blob} = await generateDocument(
        "http://5.35.84.165:9000/api/doc/kp",
        {orderId: +route.params.id},
        "doc")
    blob && saveAs(blob, "doc.docx")
}

const print = () => {
    router.push("/commerce/print/" + route.params.id)
}

onBeforeUnmount(() => {
    unwatchRoute()
    unwatchApplicationNumber()
    unwatchCompanyId()
    unwatchBusinessProposal()
})
</script>


<style scoped lang="sass">
.bar
    margin-left: auto
    display: flex
    justify-content: flex-end
    gap: 1rem
</style>
