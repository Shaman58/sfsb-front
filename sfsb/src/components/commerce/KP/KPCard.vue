<template lang="pug">
    LayoutMain
        template(#default)
            .kp-header
                div(:style="{height:'10px', width:'100%'}")
                    v-progress-linear(indeterminate v-if="loading")
                v-card.kp-header__card(width="100%")
                    v-card-actions
                        KPBar(
                            @save="saveKP"
                            @copy="copyKP"
                            @refresh="refresh"
                            @download="download"
                            @print="print"
                            :disabled="route.params.id==='new'"
                            :kp="currentKP"
                        )
            .kp-main
                v-form(ref="form" v-model="valid")
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
import {computed, onBeforeUnmount, type Ref, ref, watch, watchEffect} from "vue";
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
import {useToast} from "vue-toast-notification";

const router = useRouter()
const route = useRoute()
const toast = useToast()
const {loading, kp} = storeToRefs(useKPStore())
const {get, save} = useKPStore()

const currentKP: Ref<KP | null> = ref(null)
const items = ref<KPItem[]>([])

const form = ref<HTMLFormElement>()
const valid = ref(false);
watchEffect(() => console.log("valid", valid.value))

const {generateDocument} = useOfferGenerator()

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

const init = () => {
    if (!Number.isNaN(Number(+route.params.id))) {
        currentKP.value = (kp.value.find(e => e.id === +route.params.id)) || null
    }
    if (route.params.id === "new" && !route.params?.clone) {
        currentKP.value = Empty.KP()
        currentKP.value!.items = [Empty.KPItem()]
        user.value && (currentKP.value!.managerUuid = user.value.id)
        user.value && (currentKP.value!.createdBy = user.value.id)
    }
    if (route.params.id === "new" && route.params?.clone) {
        if (Number.isNaN(+route.params?.clone)) {
            currentKP.value = Empty.KP()
            user.value && (currentKP.value!.managerUuid = user.value.id)
            return
        }
        currentKP.value = (kp.value.find(e => e.id === +route.params.clone)) || null
        user.value && currentKP.value && (currentKP.value!.managerUuid = user.value.id)
        currentKP.value && (currentKP.value!.applicationNumber = -1)
    }
    items.value = currentKP.value?.items || [] as KPItem[]
    companyId.value = currentKP.value?.companyId
    customerId.value = currentKP.value?.customerId
    businessProposal.value = currentKP.value?.businessProposal
    applicationNumber.value = currentKP.value?.applicationNumber

}

const isEmptyItems = computed(() => items.value.every(e => e.amount && e.itemPrice && e.decimal))
const saveKP = async () => {
    if (!form.value) return
    form.value.validate()
    if (!valid.value) return

    if (!isEmptyItems.value) return toast.error("Вы не указали ни одной позиции")
    const businessProposal = currentKP.value?.businessProposal || ""
    const applicationNumber = currentKP.value?.applicationNumber || 0
    const managerUuid = currentKP.value?.managerUuid || user.value?.id || ""
    const res = await save({
        ...currentKP.value,
        businessProposal,
        applicationNumber,
        system: false,
        createdBy: user.value!.id,
        companyId: companyId.value || 0,
        customerId: customerId.value || 0,
        managerUuid,
        items: items.value
    })
    //переходим по id, полученный в ответе
    if (res && typeof res === "object") {
        ("id" in res) && await router.push(`/commerce/kp/${res.id}`)
    }
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

.kp-main
    margin-top: 1rem

.kp-header
    position: sticky
    top: 0
    width: 100%
    z-index: 1
    background: rgb(var(--v-theme-surface))
    border-radius: 10px
    box-shadow: 0 3px 12px #7777


</style>
