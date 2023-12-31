<template>
    <v-container fluid v-if="currentItem">
        <v-dialog v-model="dialogVisible" fullscreen persistent>
            <v-form ref="form" v-model="valid" @submit.prevent="save()" style="overflow-y: auto;">
                <v-card class="dialog-content">
                    <v-card-title>
                        <div class="technology-card__title">
                            <div class="technology-card__title-main">
                                <span class="text-h4">{{ currentItem && currentItem.technology.drawingNumber + " " +
                                    currentItem && currentItem.technology.drawingName }}</span>
                                {{ currentItem.quantity + "шт." }}
                            </div>
                            <Suspense>
                                <template #fallback>Loading ...</template>
                                <template #default>
                                    <technology-card-owner @change="changeOwner" />
                                </template>
                            </Suspense>
                        </div>
                    </v-card-title>
                    <v-card-text :untouchable="!isBlockedByCurrentUser">
                        <v-row>
                            <v-col>
                                <v-switch v-model="currentItem.technology.assembly" :true-value="true" :false-value="false"
                                    :label="currentItem.technology.assembly ? 'Сборка' : 'Деталь'">
                                </v-switch>
                                <v-card v-if="!workpieceCardVisible && !currentItem.technology.assembly" width="200"
                                    title="Заготовка:" @click="showWorkpieceCard">
                                    <v-card-item>
                                        {{
                                            !!currentItem.technology.workpiece ?
                                            formatWorkpieceData(currentItem.technology.workpiece) :
                                            "Задать заготовку"
                                        }}
                                    </v-card-item>
                                </v-card>
                                <tech-workpiece-card v-else-if="!currentItem.technology.assembly"
                                    :workpiece="{ ...currentItem.technology.workpiece }" :materials="materials"
                                    @validatedWorkpiece="saveWorkpiece" @hide="hideWorkpieceCard" />
                            </v-col>
                            <v-col cols="9" v-if="!workpieceCardVisible">
                                <TechnologyCardMainOptions />
                            </v-col>
                        </v-row>

                        <br />
                        <v-divider />
                        <br />

                        <v-row>

                            <v-col cols="12" v-for="(setup, index) in sortedSetups" :key="index">
                                <v-card v-if="activeSetupIndex !== index" @click="showSetupCard(index)">
                                    <v-row>

                                        <!-- 1 часть карточки -->
                                        <v-col cols="3" v-if="!setup.cooperate">
                                            <v-card>
                                                <v-card-title>
                                                    <a>
                                                        {{ "№" + setup.setupNumber + " " + setup.operation.operationName }}
                                                    </a>
                                                    <p
                                                        v-if="setup.group && Number(currentItem.technology.quantityOfPartsFromWorkpiece) !== 1">
                                                        Групповая
                                                    </p>
                                                </v-card-title>
                                                <v-card-item>
                                                    {{ compactInfo(setup) }}
                                                </v-card-item>
                                                <v-list density="compact" style="padding: 0;" :lines="false" v-if="!!setup.toolings && setup.operation.operationTimeManagement !== 'COMPUTED'
                                                    && setup.operation.operationTimeManagement !== 'NONE'">
                                                    <v-list-item v-for="tooling in setup.toolings"
                                                        :title="tooling.toolName" />
                                                </v-list>
                                            </v-card>
                                        </v-col>

                                        <!-- 2 часть карточки -->
                                        <v-col cols="3" v-if="!setup.cooperate
                                            && setup.operation.operationTimeManagement !== 'COMPUTED'
                                            && setup.operation.operationTimeManagement !== 'NONE'">
                                            <v-card height="100%"
                                                v-if="setup.additionalTools.length !== 0 || setup.additionalComments !== null && setup.additionalComments?.length > 0">
                                                <v-list density="compact" style="padding: 0;" :lines="false">
                                                    <v-list-item v-for="(tool, index) in setup.additionalTools" :key="index"
                                                        :title="tool.toolName + ' ' + tool.amount + 'шт.'"
                                                        :subtitle="formatWorkpieceData(tool.workpiece)">
                                                    </v-list-item>
                                                    <v-list-item :title="setup.additionalComments">
                                                    </v-list-item>
                                                </v-list>
                                            </v-card>
                                        </v-col>

                                        <!-- 3 часть карточки -->
                                        <v-col cols="3" v-if="!setup.cooperate
                                            && setup.operation.operationTimeManagement !== 'COMPUTED'
                                            && setup.operation.operationTimeManagement !== 'NONE'">
                                            <v-card height="100%"
                                                v-if="setup.cutterToolItems.length !== 0 || setup.specialToolItems.length !== 0">
                                                <v-list density="compact" style="padding: 0;" :lines="false">
                                                    <v-list-item v-for="(tool, index) in setup.cutterToolItems" :key="index"
                                                        :title="tool.tool.toolName + ' ' + tool.amount + 'шт.'"
                                                        :subtitle="tool.tool.description">
                                                    </v-list-item>
                                                </v-list>
                                                <v-list density="compact" style="padding: 0;" :lines="false">
                                                    <v-list-item v-for="(tool, index) in setup.specialToolItems"
                                                        :key="index" :title="tool.tool.toolName + ' ' + tool.amount + 'шт.'"
                                                        :subtitle="tool.tool.description">
                                                    </v-list-item>
                                                </v-list>
                                            </v-card>
                                        </v-col>

                                        <!-- 4 часть карточки -->
                                        <v-col cols="3" fill-height v-if="!setup.cooperate
                                            && setup.operation.operationTimeManagement !== 'COMPUTED'
                                            && setup.operation.operationTimeManagement !== 'NONE'">
                                            <v-card height="100%" v-if="setup.measureToolItems.length !== 0">
                                                <v-list density="compact" style="padding: 0;" :lines="false">
                                                    <v-list-item v-for="(tool, index) in setup.measureToolItems"
                                                        :key="index" :title="tool.tool.toolName + ' ' + tool.amount + 'шт.'"
                                                        :subtitle="tool.tool.description">
                                                    </v-list-item>
                                                </v-list>
                                            </v-card>
                                        </v-col>

                                        <!-- 1234 часть карточки кооперация -->
                                        <v-col cols="12" fill-height v-if="setup.cooperate">
                                            <v-card height="100%"
                                                :title="'№' + setup.setupNumber + ' ' + setup.operation.operationName + ' кооперация'"
                                                color="rgba(161, 48, 13, 0.24)">
                                            </v-card>
                                        </v-col>

                                        <!-- 234 часть карточки текст-->
                                        <v-col cols="9" fill-height
                                            v-else-if="setup.operation.operationTimeManagement === 'COMPUTED'">
                                            <v-card height="100%"
                                                :title="setup.aggregate ? 'Групповая по ' + setup.perTime + 'шт.' : ''">
                                                {{ setup.text }}
                                            </v-card>
                                        </v-col>

                                    </v-row>
                                </v-card>
                                <setup-create-card v-else :setup="{ ...setup }"
                                    :quantity-of-parts-from-workpiece="Number(currentItem.technology.quantityOfPartsFromWorkpiece)"
                                    :additionalTexts="additionalTexts" @hideSetup="hideSetup()"
                                    @deleteSetup="deleteSetup(index)" @save="replaceSetup($event, index)" />
                            </v-col>

                            <v-col cols="12">
                                <v-card v-if="activeSetupIndex !== 'new'" title="Новый установ"
                                    @click="activeSetupIndex = 'new'">
                                </v-card>
                                <setup-create-card v-else :setup="{ ...newSetup }"
                                    :quantity-of-parts-from-workpiece="Number(currentItem.technology.quantityOfPartsFromWorkpiece)"
                                    :additionalTexts="additionalTexts" @hideSetup="hideSetup()" @save="pushSetup" />
                            </v-col>

                        </v-row>

                    </v-card-text>
                    <v-card-actions>
                        <v-col cols="2" class="technology-card__calculate">

                            <span>{{ currentItem.technology.computed ? 'Рассчитан' : 'Не рассчитан' }}</span>
                            <v-switch class="technology-card__switch" v-model="calculate"
                                :disabled="!isBlockedByCurrentUser"></v-switch>

                        </v-col>
                        <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="isSaveActive"
                            :untouchable="!isBlockedByCurrentUser">
                            Сохранить
                        </v-btn>
                        <!-- <v-btn color="orange-darken-1" variant="text" :disabled="isSaveActive" @click.stop="calculateItem"
                            :untouchable="!isBlockedByCurrentUser">
                            Рассчитать
                        </v-btn> -->

                        <v-spacer></v-spacer>
                        <v-btn color="orange-darken-1" variant="text" @click="hideDialog">
                            Закрыть
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
    </v-container>
    <AlertDialog ref="alertDialog" />
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { ComputedRef, Ref, computed, ref, watch } from "vue";
import TechWorkpieceCard from "@/components/technology/TechWorkpieceCard.vue";
import SetupCreateCard from "@/components/technology/SetupCreateCard.vue";
import 'vue-toast-notification/dist/theme-bootstrap.css'
import materialDataFormatting from '@/mixins/MaterialDataFormatting'
import { useValidationRules } from "@/mixins/FieldValidationRules";

import TechnologyCardOwner from "./TechnologyCardOwner.vue";
import { useTechnologyStore } from "@/pinia-store/technology";
import { storeToRefs } from "pinia"
import AlertDialog from "../common/AlertDialog.vue";
import { useCurrentUserStore } from "@/pinia-store/currentUser";
import TechnologyCardMainOptions from "./TechnologyCardMainOptions.vue";
import { useMaterialsStore } from "@/pinia-store/materials";
import {ca} from "vuetify/locale";

const { dialogVisible, currentItem, isBlockedByCurrentUser } = storeToRefs(useTechnologyStore());
const { saveTechnology, changeBlocked, calculateTechnology } = useTechnologyStore();

const alertDialog = ref<typeof AlertDialog | null>(null)

const { user } = storeToRefs(useCurrentUserStore())

const emit = defineEmits(["close"])

const { rules } = useValidationRules();
const store = useStore();
const form = ref(null);
const valid = ref(false);
const workpieceCardVisible = ref(false);
const { formatMaterialData, formatWorkpieceData } = materialDataFormatting();
const activeSetupIndex: Ref<number | null> = ref(null);
const saveActive = ref(true);

const calculate = ref(currentItem.value.technology && currentItem.value.technology.computed)
watch([calculate], () => {
    dialogVisible.value && calculate.value !== currentItem.value.technology.computed && calculateTechnology(currentItem.value.technology.id, calculate.value)
    setTimeout(()=>calculate.value = currentItem.value.technology.computed, 500)
})
watch([dialogVisible], () => {
    dialogVisible.value && (calculate.value = currentItem.value.technology.computed)
})


const isDialogVisible = computed(() => store.getters.isTechnologyDialogVisible);
const item = computed(() => {
    const item = currentItem;
    if (!currentItem.value.technology.technologistTime) {
        currentItem.value.technology.technologistTime = '00:00';
    }
    return item;
});

const { materials } = storeToRefs(useMaterialsStore())
const { fetchMaterials } = useMaterialsStore()
await fetchMaterials()

const changeOwner = (event: boolean) => {
    console.log("changeOwner", event)
    // changeBlocked(event);
}
interface Setup {
    groupAble?: boolean
}
const sortedSetups: ComputedRef<Setup[]> = computed(() => {
    if (currentItem.value.technology.setups.length !== 0) {
        const setups = currentItem.value.technology.setups.slice().sort((a: { setupNumber: number; }, b: { setupNumber: number; }) => a.setupNumber - b.setupNumber);

        setups[0].groupAble = true;

        for (let i = 1; i < setups.length; i++) {
            setups[i].groupAble = setups[i - 1].groupAble && setups[i - 1].group; // Добавляем поле groupAble
            if (!setups[i].groupAble) {
                setups[i].group = false;
            }
            if (setups[i].operation.operationTimeManagement === 'COMPUTED') {
                setups[i].group = setups[i - 1].group;
            }
        }
        return setups;
    }
    return [];
});

const additionalTexts = computed(() => {
    if (sortedSetups.value.length > 0) {
        return sortedSetups.value.flatMap((setup: any) => additionalTextGenerator(setup));
    }
    return [];
});

const additionalTextGenerator = (setup: { additionalTools: any[]; setupNumber: any; }) => {
    if (setup.additionalTools.length > 0) {
        return setup.additionalTools.flatMap((tool: { toolName: any; }) => `Использовать ПБ '${tool.toolName}' с установки  ${setup.setupNumber}`);
    }
    return [];
}

const compactInfo = ((data: { operation: { operationTimeManagement: string; }; processTime: any; setupTime: any; interoperativeTime: any; }) => {
    if (data.operation?.operationTimeManagement === 'COMPUTED'
        || data.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY') {
        return `Обработка: ${data.processTime}`
    } else if (data.operation?.operationTimeManagement === 'FULL') {
        return `Обработка: ${data.processTime} Наладка: ${data.setupTime} Межоперационка: ${data.interoperativeTime}`
    } else {
        return '';
    }
});

const calculateSetupNumber = computed(() => {
    if (!currentItem.value.technology.setups) {
        return -1
    }
    const setupNumbers = currentItem.value.technology.setups.map((setup: { setupNumber: any; }) => setup.setupNumber);
    for (let i = 10; i <= Number.MAX_SAFE_INTEGER; i = i + 10) {
        if (!setupNumbers.includes(i)) {
            return i;
        }
    }
    return -1;
});

const isSaveActive = computed(() => !valid.value || !saveActive.value || (!currentItem.value.technology.workpiece && !currentItem.value.technology.assembly)
);

const createNewSetup = () => ({
    setupTime: "00:00",
    processTime: "00:00",
    interoperativeTime: "00:00",
    measureToolItems: [],
    specialToolItems: [],
    cutterToolItems: [],
    toolings: [],
    additionalTools: [],
    setupNumber: calculateSetupNumber,
    operation: {
        operationName: ''
    },
    cooperatePrice: { amount: 0, currency: 'RUB' }
});

const newSetup = ref(createNewSetup());

const pushSetup = ({ ...setup }) => {
    hideSetup();
    currentItem.value.technology.setups.push(setup);
    newSetup.value = createNewSetup();
};

const replaceSetup = async (setup: { [x: string]: any; }, index: any) => {
    await deleteSetup(index);
    pushSetup(setup);
};

const hideSetup = () => {
    isBlockedByCurrentUser.value && (activeSetupIndex.value = null);
};

const deleteSetup = async (index: string | number) => {
    const setupNumberToDelete = sortedSetups.value[index].setupNumber;
    const indexInOriginalList = currentItem.value.technology.setups.findIndex((setup: { setupNumber: any; }) => setup.setupNumber === setupNumberToDelete);

    if (indexInOriginalList !== -1) {
        currentItem.value.technology.setups.splice(indexInOriginalList, 1);
    }
};

const showSetupCard = (index: number) => {
    isBlockedByCurrentUser.value && (activeSetupIndex.value = index)
}


const hideDialog = () => {
    store.commit("setTechnologyDialogVisible", false);
    dialogVisible.value = false;
    emit("close")
};

const save = async () => {
    console.log(currentItem, user)
    if (alertDialog.value && currentItem.value.technology.blocked !== user.value.id) {
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
    currentItem.value.technology.computed = false;
    //   await store.dispatch("saveTechnology", currentItem.value.technology);
    await store.dispatch("fetchItem", currentItem.value.id);
    await store.dispatch("fetchItems");
    saveActive.value = true;
    await saveTechnology(currentItem.value.technology);
    calculate.value = currentItem.value.technology && currentItem.value.technology.computed
};

// const calculateItem = async () => {
//     if (!saveActive.value) return;
//     saveActive.value = false;
//     currentItem.value.technology.computed = false;
//     await store.dispatch("saveTechnology", currentItem.value.technology);
//     await store.dispatch("calculateItem", currentItem.value.id);
//     await store.dispatch("fetchItem", currentItem.value.id);
//     await store.dispatch("fetchItems");
//     saveActive.value = true;
// };

const saveWorkpiece = (validWorkpiece: any) => {
    currentItem.value.technology.workpiece = validWorkpiece;
};

const hideWorkpieceCard = () => {
    workpieceCardVisible.value = false;
};

const showWorkpieceCard = () => {
    workpieceCardVisible.value = true;
};

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
    &__calculate
        display: flex
        align-items: center
        gap: .5rem


    &__switch
        .v-input__details
            display: none

</style>
