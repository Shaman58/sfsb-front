<template lang="pug">
    v-container.pa-0(fluid v-if="currentItem")
        v-dialog(v-model="dialogVisible" :fullscreen="true" scrollable)
            v-form(ref="form" v-model="valid" @submit.prevent="save" style="overflow-y: auto;")
                v-card.dialog-content
                    v-card-title
                        .technology-card__title
                            .technology-card__title-main
                                span.text-h4 {{ currentItem && currentItem.technology.drawingNumber + " " + currentItem && currentItem.technology.drawingName }}
                                span {{ currentItem.quantity + "шт." }}
                            suspended-component
                                technology-card-owner(@change="changeOwner")

                    v-card-text(:untouchable="!isBlockedByCurrentUser")
                        v-row
                            v-col
                                v-switch(cols="12" md="6" v-model="currentItem.technology.assembly" :true-value="true" :false-value="false" :label="currentItem.technology.assembly ? 'Сборка' : 'Деталь'")
                                v-card(cols="12" md="6" v-if="!workpieceCardVisible && !currentItem.technology.assembly" width="200" title="Заготовка:" @click="showWorkpieceCard")
                                    v-card-item {{ !!currentItem.technology.workpiece ? formatWorkpieceData(currentItem.technology.workpiece) : "Задать заготовку"}}
                                tech-workpiece-card(v-else-if="!currentItem.technology.assembly" :workpiece="{ ...currentItem.technology.workpiece }" :materials="materials" @validatedWorkpiece="saveWorkpiece" @hide="hideWorkpieceCard")

                            v-col(cols="12" md="9" v-if="!workpieceCardVisible")
                                TechnologyCardMainOptions

                        br
                        v-divider
                        br

                        v-row
                            v-col(cols="12" v-for="(setup, index) in sortedSetups" :key="index")
                                v-card(v-if="activeSetupIndex !== index" @click="showSetupCard(index)")
                                    v-row
                                        v-col(cols="12" lg="3" md="6" v-if="!setup.cooperate")
                                            TechnologyCreateDialogCardPart1(:setup="setup")
                                        v-col(cols="12" lg="3" md="6" v-if="!setup.cooperate && setup.operation.operationTimeManagement !== 'COMPUTED' && setup.operation.operationTimeManagement !== 'NONE'")
                                            TechnologyCreateDialogCardPart2(:setup="setup")
                                        v-col(cols="12" lg="3" md="6" v-if="!setup.cooperate  && setup.operation.operationTimeManagement !== 'COMPUTED' && setup.operation.operationTimeManagement !== 'NONE'")
                                            TechnologyCreateDialogCardPart3(:setup="setup")
                                        v-col(cols="12" lg="3" md="6" fill-height v-if="!setup.cooperate  && setup.operation.operationTimeManagement !== 'COMPUTED'  && setup.operation.operationTimeManagement !== 'NONE'")
                                            TechnologyCreateDialogCardPart4(:setup="setup")

                                        // 1234 часть карточки кооперация
                                        v-col(cols="12" fill-height v-if="setup.cooperate")
                                            v-card(height="100%" :title="'№' + setup.setupNumber + ' ' + setup.operation.operationName + ' кооперация'" color="rgba(161, 48, 13, 0.24)")

                                        //234 часть карточки текст
                                        v-col(cols="9" fill-height v-else-if="setup.operation.operationTimeManagement === 'COMPUTED'")
                                            v-card(height="100%" :title="setup.aggregate ? 'Групповая по ' + setup.perTime + 'шт.' : ''") {{ setup.text }}

                                suspended-component(v-else)
                                    setup-create-card(
                                        :setup="setup"
                                        :quantity-of-parts-from-workpiece="Number(currentItem.technology.quantityOfPartsFromWorkpiece)"
                                        :additionalTexts="additionalTexts"
                                        @hideSetup="hideSetup()"
                                        @deleteSetup="void deleteSetup(index)"
                                        @save="void replaceSetup($event, index)"
                                        @incorrect-setup="void deleteSetup(index)"
                                    )

                            v-col(cols="12")
                                v-card(v-if="activeSetupIndex !== 'new'" title="Новый установ" @click="addSetup")
                                //suspended-component(v-else)
                                //    setup-create-card(
                                //        :setup="currentItem.technology.setups.at(-1)"
                                //        :quantity-of-parts-from-workpiece="Number(currentItem.technology.quantityOfPartsFromWorkpiece)"
                                //        :additionalTexts="additionalTexts"
                                //        @hideSetup="hideSetup()"
                                //    )

                    v-card-actions.technology-card__actions
                        .technology-card__calculate
                            span {{ currentItem.technology.computed ? 'Рассчитан' : 'Не рассчитан' }}
                            v-switch.technology-card__switch(v-model="calculate" :disabled="!isBlockedByCurrentUser")
                            v-btn.technology-card__save(color="orange-darken-1" variant="text" type="submit" :disabled="isSaveActive" :untouchable="!isBlockedByCurrentUser") Сохранить
                        .technology-card__close
                            v-btn(color="orange-darken-1" variant="text" @click="hideDialog") Закрыть

    AlertDialog(ref="alertDialog")
</template>

<script setup lang="ts">
import {computed, type Ref, ref, watch} from "vue";
import TechWorkpieceCard from "@/components/technology/TechWorkpieceCard.vue";
import SetupCreateCard from "@/components/technology/SetupCreateCard.vue";
import 'vue-toast-notification/dist/theme-bootstrap.css'
import materialDataFormatting from '@/mixins/MaterialDataFormatting'
import {useValidationRules} from "@/mixins/FieldValidationRules";

import TechnologyCardOwner from "./TechnologyCardOwner.vue";
import {useTechnologyStore} from "@/pinia-store/technology";
import {storeToRefs} from "pinia"
import AlertDialog from "../common/AlertDialog.vue";
import {useCurrentUserStore} from "@/pinia-store/currentUser";
import TechnologyCardMainOptions from "./TechnologyCardMainOptions.vue";
import TechnologyCreateDialogCardPart1
    from "@/components/technology/TechnologyCreateDialogCardParts/TechnologyCreateDialogCardPart1.vue";
import TechnologyCreateDialogCardPart3
    from "@/components/technology/TechnologyCreateDialogCardParts/TechnologyCreateDialogCardPart3.vue";
import TechnologyCreateDialogCardPart2
    from "@/components/technology/TechnologyCreateDialogCardParts/TechnologyCreateDialogCardPart2.vue";
import TechnologyCreateDialogCardPart4
    from "@/components/technology/TechnologyCreateDialogCardParts/TechnologyCreateDialogCardPart4.vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import {useCuttersStore, useMaterialsStore, useSpecialStore, useToolingStore} from "@/pinia-store/tools";
import {useOperationsStore} from "@/pinia-store/operations";
import {useItemStore} from "@/pinia-store/item";
import {Empty} from "@/mixins/Empty";
import {useOrdersStore} from "@/pinia-store/orders";

const {dialogVisible, currentItem, isBlockedByCurrentUser} = storeToRefs(useTechnologyStore());
const {saveTechnology, changeBlocked, calculateTechnology, setTechnologyDialogVisible} = useTechnologyStore();

const alertDialog = ref<typeof AlertDialog | null>(null)

const {tools: specials} = storeToRefs(useSpecialStore())
const {loadAll: loadSpecials} = useSpecialStore()
!specials.value.length && loadSpecials()

const {tools: cutters} = storeToRefs(useCuttersStore())
const {loadAll: loadCutters} = useCuttersStore()
!specials.value.length && loadCutters()

const {tools: toolings} = storeToRefs(useToolingStore())
const {loadAll: loadToolings} = useToolingStore()
!toolings.value.length && loadToolings()

const {tools: materials} = storeToRefs(useMaterialsStore())
const {loadAll: loadMaterials} = useMaterialsStore()
!materials.value.length && loadMaterials()

const {operations} = storeToRefs(useOperationsStore())
const {fetchOperation} = useOperationsStore()
!operations.value.length && await fetchOperation()

const {items} = storeToRefs(useItemStore())
const {fetchItems, fetchItem} = useItemStore()
!items.value.length && await fetchItems()

const {getOrders} = useOrdersStore()


const {user} = storeToRefs(useCurrentUserStore())

const emit = defineEmits(["close"])

const {rules} = useValidationRules();
const form = ref(null);
const valid = ref(false);
const workpieceCardVisible = ref(false);
const {formatMaterialData, formatWorkpieceData} = materialDataFormatting();
const activeSetupIndex: Ref<number | string | null> = ref(null);
const saveActive = ref(true);

const calculate = ref(currentItem.value.technology && currentItem.value.technology.computed)
watch([calculate], async () => {
    dialogVisible.value && calculate.value !== currentItem.value.technology.computed && await calculateTechnology(currentItem.value.technology.id, calculate.value)
    calculate.value = currentItem.value.technology.computed
})
watch([dialogVisible], () => {
    dialogVisible.value && (calculate.value = currentItem.value.technology.computed)
})


const item = computed(() => {
    const item = currentItem;
    if (!currentItem.value.technology.technologistTime) {
        currentItem.value.technology.technologistTime = '00:00';
    }
    return item;
});


const changeOwner = (event: boolean) => {
    console.log("changeOwner", event)
    // changeBlocked(event);
}


const sortedSetups = computed<Setup[]>(() => {
    if (currentItem.value.technology.setups.length !== 0) {
        const setups = currentItem.value.technology.setups.slice().sort((a: { setupNumber: number; }, b: {
            setupNumber: number;
        }) => a.setupNumber - b.setupNumber);

        // setups[0].groupAble = true;

        for (let i = 1; i < setups.length; i++) {
            // setups[i].groupAble = setups[i - 1].groupAble && setups[i - 1].group; // Добавляем поле groupAble
            if (!setups[i].groupAble) {
                setups[i].group = false;
            }
            if (setups[i].operation.operationTimeManagement === 'COMPUTED') {
                setups[i].group = setups[i - 1].group;
            }
        }
        return setups;
    }
    return [] as Setup[];
});

const additionalTexts = computed(() => {
    if (sortedSetups.value.length > 0) {
        return sortedSetups.value.flatMap((setup: any) => additionalTextGenerator(setup));
    }
    return [];
});

const additionalTextGenerator = (setup: Setup) => {
    if (setup.additionalTools.length > 0) {
        return setup.additionalTools.flatMap((tool: {
            toolName: any;
        }) => `Использовать ПБ '${tool.toolName}' с установки  ${setup.setupNumber}`);
    }
    return [];
}

const calculateSetupNumber = computed(() => {
    if (!("technology" in currentItem.value) || !currentItem.value.technology?.setups.length) {
        return 10
    }
    // const setupNumbers = currentItem.value.technology.setups.map((setup: { setupNumber: any; }) => setup.setupNumber);
    // for (let i = 10; i <= Number.MAX_SAFE_INTEGER; i = i + 10) {
    //     if (!setupNumbers.includes(i)) {
    //         return i;
    //     }
    // }
    // return -1;
    const lastSetupNumber = Number(currentItem.value.technology.setups.at(-1)!.setupNumber)
    console.log(currentItem.value.technology.setups.sort((a, b) => b.setupNumber - a.setupNumber))
    return lastSetupNumber % 10 ? (lastSetupNumber - lastSetupNumber % 10) + 10 : lastSetupNumber + 10
})

const isSaveActive = computed(() => !valid.value || !saveActive.value || (!currentItem.value.technology.workpiece && !currentItem.value.technology.assembly)
);

// const createNewSetup = () => ({
//     setupTime: "00:00",
//     processTime: "00:00",
//     interoperativeTime: "00:00",
//     measureToolItems: [],
//     specialToolItems: [],
//     cutterToolItems: [],
//     toolings: [],
//     additionalTools: [],
//     setupNumber: calculateSetupNumber.value,
//     operation: {
//         operationName: '',
//         operationTimeManagement: "FULL"
//     },
//     cooperatePrice: {amount: 0, currency: 'RUB'}
// } as Partial<Setup>);

const newSetup = ref({...Empty.Setup(), setupNumber: calculateSetupNumber.value})

const pushSetup = (setup: Setup) => {
    hideSetup();
    currentItem.value.technology.setups.push(setup);
    newSetup.value = {...Empty.Setup(), setupNumber: calculateSetupNumber.value};
};

const replaceSetup = async (setup: Setup, index: any) => {
    await deleteSetup(index);
    pushSetup(setup);
};

const hideSetup = () => {
    isBlockedByCurrentUser.value && (activeSetupIndex.value = null);
};

const addSetup = () => {
    const lastSetup = currentItem.value.technology.setups.sort((a, b) => a.setupNumber - b.setupNumber).at(-1)
    const isGroupable = lastSetup && lastSetup.groupAble ? lastSetup.groupAble : true
    const newSetup = {
        ...Empty.Setup(),
        setupNumber: lastSetup ? (Math.floor(lastSetup.setupNumber / 10) + 1) * 10 : 10,
        groupAble: isGroupable,
        group: isGroupable || lastSetup?.group
    } as Setup
    currentItem.value.technology.setups.push(newSetup)

    activeSetupIndex.value = currentItem.value.technology.setups.length - 1
}

const deleteSetup = async (index: string | number) => {
    const setupNumberToDelete = sortedSetups.value[+index].setupNumber;
    const indexInOriginalList = currentItem.value.technology.setups.findIndex((setup: {
        setupNumber: any;
    }) => setup.setupNumber === setupNumberToDelete);

    if (indexInOriginalList !== -1) {
        currentItem.value.technology.setups.splice(indexInOriginalList, 1);
    }
};

const showSetupCard = (index: number) => {
    isBlockedByCurrentUser.value && (activeSetupIndex.value = index)
}


const hideDialog = () => {
    setTechnologyDialogVisible(false)
    dialogVisible.value = false;
    emit("close")
};

const save = async () => {
    console.log(currentItem, user)
    if (alertDialog.value && currentItem.value.technology.blocked !== user.value?.id) {
        alertDialog.value.show();
        try {
            const res = await alertDialog.value.getAnswer()
            if (!res) return
        } catch (error) {
            return
        } finally {
            alertDialog.value.hide();
        }

    }
    if (!saveActive.value) return;
    saveActive.value = false;
    // currentItem.value.technology.computed = false;
    currentItem.value.id && await fetchItem(currentItem.value.id);
    await fetchItems();
    await getOrders()
    saveActive.value = true;
    await saveTechnology(currentItem.value.technology);
    calculate.value = currentItem.value.technology && currentItem.value.technology.computed
};


const saveWorkpiece = (validWorkpiece: any) => {
    currentItem.value.technology.workpiece = validWorkpiece;
};

const hideWorkpieceCard = () => {
    workpieceCardVisible.value = false;
};

const showWorkpieceCard = () => {
    workpieceCardVisible.value = true;
};

watch([currentItem], () => {
    newSetup.value = {...Empty.Setup(), setupNumber: calculateSetupNumber.value}

}, {immediate: true})

</script>

<style lang="sass">
.dialog-content
    max-height: 100vh
    overflow-y: auto

.v-toast
    z-index: 9999 !important

.computed
    border: 1px solid #97ffa0
    border-radius: 10px
    margin: 2px

.technology-card

    &__owner
        display: flex
        flex-direction: column
        align-items: center
        gap: .5rem

    &__title
        display: flex
        align-items: center
        justify-content: space-between
        flex-wrap: wrap

    &__title-main

        & > * + *
            margin-left: .5rem

    &__actions
        display: flex
        align-items: center
        justify-content: space-between
        gap: .5rem
        flex-wrap: wrap

    &__calculate
        display: flex
        align-items: center
        gap: .5rem

    &__save
        flex: 1


    &__switch.v-input
        flex-shrink: 0

        .v-input__details
            display: none

</style>
