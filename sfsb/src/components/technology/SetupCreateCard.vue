<template lang="pug">
    v-card
        v-form(ref="form" v-model="valid" @submit.prevent="save(setup)")
            v-card-title
                span.text-h5 Установка: {{setup.setupNumber}}
            v-card-text.setup-create-content
                v-container
                    v-row
                        v-col(cols="12" md="6" lg="4")
                            v-switch(
                                v-model="setup.cooperate"
                                :true-value="true"
                                :false-value="false"
                                :label="setup.cooperate ? 'Кооперация' : 'Не кооперация'")
                        v-col(
                            cols="12"
                            md="6"
                            lg="4"
                            v-if="setup?.operation?.operationTimeManagement === 'COMPUTED' && !setup.cooperate"
                        )
                            v-switch(
                                v-model="setup.aggregate"
                                :true-value="true"
                                :false-value="false"
                                :label="setup.aggregate ? 'Несколько заготовок' : 'Одна заготовка'")
                        v-col(cols="12" md="6" lg="4" v-if="isWorkpiece")
                            v-switch(
                                v-model="setup.group"
                                :true-value="true"
                                :false-value="false"
                                :label="setup.group ? 'С заготовкой' : 'С деталью'")
                        v-col(cols="12" md="6" lg="4" v-if="setup?.operation?.operationTimeManagement === 'COMPUTED' && setup.aggregate && !setup.cooperate")
                            v-text-field(
                                label="Количество заготовок за раз"
                                v-model="setup.perTime"
                                type="number"
                                :rules="[rules.numberGreaterThanZero]"
                                autocomplete="false"
                            )
                    v-row.align-center
                        //v-col.pb-2(cols="1")
                            //v-text-field(
                            //    label="Номер установки"
                            //    v-model="setup.setupNumber"
                            //    :rules="[unitNumberValidationRule, rules.required]"
                            //    autocomplete="false"
                            //)
                        v-col(cols="10" md="6" lg="4")
                            v-combobox(
                                label="Название установки"
                                :items="operations"
                                item-title="operationName"
                                return-object
                                v-model="setup.operation"
                                :rules="[rules.required]")
                        v-col(cols="12" md="6" lg="4" v-if="setup.operation?.operationName && setup.cooperate")
                            v-text-field(
                                label="Кооперационная цена на деталь"
                                v-model="setup.cooperatePrice.amount"
                                type="number"
                                :rules="[rules.required, rules.numeric, rules.min0Validation]"
                                autocomplete="false"
                            )
                        v-col(cols="12" md="6" lg="4" v-if="setup.operation?.operationName && setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate  || setup?.operation?.operationTimeManagement === 'COMPUTED' && !setup.cooperate  || setup?.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY' && !setup.cooperate")
                            v-text-field(
                                label="Время цикла(чч:мм)"
                                v-model="setup.processTime"
                                type="time"
                                :rules="[rules.durationNotZeroValidation]"
                                autocomplete="false"
                            )
                        v-col(cols="12" md="6" lg="4" v-if="setup.operation?.operationName && setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate")
                            v-text-field(
                                label="Межоперационное время(чч:мм)"
                                v-model="setup.interoperativeTime"
                                type="time"
                                :rules="[rules.durationNotZeroValidation]"
                                autocomplete="false"
                            )
                        v-col(cols="12" md="6" lg="4" v-if="setup.operation?.operationName && setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate")
                            v-text-field(
                                label="Наладочное время(чч:мм)"
                                v-model="setup.setupTime"
                                type="time"
                                :rules="[rules.durationNotZeroValidation]"
                                autocomplete="false"
                            )
                        v-col(cols="12" md="6" lg="4" v-if="setup.operation?.operationName && setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate || setup?.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY' && !setup.cooperate")
                            v-combobox(
                                v-if="!!toolings"
                                :items="toolings"
                                item-title='toolName'
                                return-object
                                v-model="setup.toolings"
                                label="Выбрать оснастку"
                                multiple
                            )

                    v-card.devices
                        v-row
                            v-col(
                                cols="12"
                                md="6"
                                lg="3"
                                v-if="setup.operation?.operationName && setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate || setup?.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY' && !setup.cooperate"
                            )
                                v-btn(
                                    size="small"
                                    variant="text"
                                    v-if="setup.measureToolItems?.length === 0"
                                    @click="measureVisible = true"
                                ) Меритель
                                v-list(
                                    v-else
                                    @click="measureVisible = true"
                                )
                                    v-list-item(
                                        v-for="tool in setup.measureToolItems"
                                        :title="tool.tool.toolName + ' ' + tool.tool.description" :subtitle="tool.amount + 'шт.'"
                                    )
                                MeasureCreateList(
                                    title="Меритель"
                                    :visible="measureVisible"
                                    :tools="setup.measureToolItems"
                                    @hide="measureVisible = false"
                                )
                            v-col(
                                cols="12"
                                md="6"
                                lg="3"
                                v-if="setup.operation?.operationName && setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate || setup?.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY' && !setup.cooperate"
                            )
                                v-btn(size="small" variant="text" v-if="setup.cutterToolItems?.length === 0" @click="cutterVisible = true") Инструмент
                                v-list(v-else @click="cutterVisible = true")
                                    v-list-item(v-for="tool in setup.cutterToolItems" :title="tool.tool.toolName" :subtitle="tool.amount + 'шт.'")
                                tool-create(title="Инструмент" :visible="cutterVisible" :toolItems="setup.cutterToolItems" :tools="cutters" @hide="cutterVisible = false")
                            v-col(
                                cols="12"
                                md="6"
                                lg="3"
                                v-if="setup.operation?.operationName && setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate || setup?.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY' && !setup.cooperate"
                            )
                                v-btn(size="small" variant="text" v-if="setup.specialToolItems?.length === 0" @click="specialVisible = true") Специнструмент
                                v-list(v-else @click="specialVisible = true")
                                    v-list-item(v-for="tool in setup.specialToolItems" :title="tool.tool.toolName" :subtitle="tool.amount + 'шт.'")
                                tool-create(title="Специнструмент" :visible="specialVisible" :toolItems="setup.specialToolItems" :tools="specials" @hide="specialVisible = false")
                            v-col(
                                cols="12"
                                md="6"
                                lg="3"
                                v-if="setup.operation?.operationName && setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate || setup?.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY' && !setup.cooperate"
                            )
                                v-btn(size="small" variant="text" v-if="setup.additionalTools?.length === 0" @click="additionalVisible = true") Приспособление
                                v-list(v-else @click="additionalVisible = true")
                                    v-list-item(v-for="tool in setup.additionalTools" :title="tool.toolName + ' ' + formatWorkpieceData(tool.workpiece)" :subtitle="tool.amount + 'шт.'")
                                additional-create(:visible="additionalVisible" :additionals="setup.additionalTools" @hide="additionalVisible = false")
                            v-col(
                                cols="12"
                                md="12"
                                lg="12"
                                v-if="setup.operation?.operationName && setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate || setup?.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY' && !setup.cooperate"
                            )
                                v-combobox.flex-full-width(label="Приспособление" v-model="setup.additionalComments" :items="additionalTexts" density="comfortable" menu-icon="" placeholder="Выберите из списка или введите свой коментарий" prepend-inner-icon="mdi-magnify" hide-details)
                            v-col(
                                cols="12"
                                md="12"
                                lg="12"
                                v-if="setup.operation?.operationName && setup?.operation?.operationTimeManagement === 'COMPUTED' && !setup.cooperate"
                            )
                                v-textarea(clearable v-model="setup.text" label="Коментарии")
            v-card-actions.flex-wrap
                v-btn.mx-1.px-0(
                    color="orange-darken-1"
                    prepend-icon="mdi-delete"
                    variant="text"
                    @click="deleteSetup(setup.setupNumber)"
                    v-if="isExist"
                    :text="windowWidth > RESOLUTION_HIDE ? 'Удалить' : ''"
                )
                v-btn.mx-1.px-0(
                    color="orange-darken-1"
                    prepend-icon="mdi-close"
                    variant="text"
                    @click="isExist ? hideSetup(setup.setupNumber): emit('incorrectSetup', setup.setupNumber)"
                    :text="windowWidth > RESOLUTION_HIDE ? 'Закрыть' : ''"
                )
                v-btn.mx-1.px-0(
                    color="blue-darken-1"
                    prepend-icon="mdi-chevron-up"
                    variant="text"
                    @click="emit('changeOrder', {setup, order: 'up'})"
                    :text="windowWidth > RESOLUTION_HIDE ? 'Поднять' : ''"
                )
                v-btn.mx-1.px-0(
                    color="green-accent-darken-1"
                    prepend-icon="mdi-chevron-down"
                    variant="text"
                    @click="emit('changeOrder', {setup, order: 'down'})"
                    :text="windowWidth > RESOLUTION_HIDE ? 'Опустить' : ''"
                )
                v-spacer(v-if="windowWidth > RESOLUTION_HIDE")
                v-btn.mx-1.px-0(
                    color="orange-darken-1"
                    prepend-icon="mdi-check"
                    variant="text"
                    type="submit"
                    :disabled="!canAdding"
                    :text ="windowWidth > RESOLUTION_HIDE ? (isExist ? 'Изменить' : 'Добавить') : ''"
                )
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watchEffect } from "vue";
import { useValidationRules } from "@/mixins/FieldValidationRules";
import ToolCreate from "@/components/technology/ToolItemCreate.vue";
import AdditionalCreate from "@/components/technology/AdditionalCreate.vue";
import materialDataFormatting from "@/mixins/MaterialDataFormatting";
import MeasureCreateList from "@/components/technology/MeasureCreateList.vue";
import { useTechnologyStore } from "@/pinia-store/technology";
import { storeToRefs } from "pinia";
import { useOperationsStore } from "@/pinia-store/operations";
import {
    useCuttersStore,
    useSpecialStore,
    useToolingStore,
} from "@/pinia-store/tools";
import { useDisplay } from "vuetify";

interface Props {
    setup: Partial<Setup>;
    quantityOfPartsFromWorkpiece?: number;
    additionalTexts: string[];
}

const { width: windowWidth } = useDisplay();
const RESOLUTION_HIDE = 768;

const props = defineProps<Props>();
const emit = defineEmits([
    "hideSetup",
    "save",
    "deleteSetup",
    "incorrectSetup",
    "changeOrder",
]);

const { setup, additionalTexts, quantityOfPartsFromWorkpiece } = toRefs(props);
console.log(setup);

const { rules } = useValidationRules();
const valid = ref(true);
const form = ref(null);
const cutterVisible = ref(false);
const measureVisible = ref(false);
const specialVisible = ref(false);
const additionalVisible = ref(false);
const { formatWorkpieceData } = materialDataFormatting();

const isExist = !!setup.value.operation?.operationName;

const { tools: specials } = storeToRefs(useSpecialStore());
const { fetchTool: fetchSpecials } = useSpecialStore();
!specials.value.length && (await fetchSpecials());

const { tools: cutters } = storeToRefs(useCuttersStore());
const { fetchTool: fetchCutters } = useCuttersStore();
!specials.value.length && (await fetchCutters());

const { tools: toolings } = storeToRefs(useToolingStore());
const { fetchTool: fetchToolings } = useToolingStore();
!toolings.value.length && (await fetchToolings());

const { currentItem } = storeToRefs(useTechnologyStore());
const { operations } = storeToRefs(useOperationsStore());
const { fetchOperation } = useOperationsStore();
!operations.value.length && (await fetchOperation());

const setupNumbers = computed(() =>
    currentItem.value.technology.setups
        .filter((item) => item.setupNumber !== setup.value.setupNumber)
        .map((obj) => obj.setupNumber)
);
const unitNumberValidationRule = rules.unitNumberValidation(setupNumbers);

const isWorkpiece = computed(() => {
    return (
        setup.value.operation?.operationName &&
        setup.value.operation?.operationTimeManagement === "FULL" &&
        !setup.value.cooperate &&
        quantityOfPartsFromWorkpiece.value !== 1 &&
        setup.value.groupAble
    );
});

const canAdding = computed(() => {
    const res = !!valid.value && !!setup.value.operation?.operationName;
    return res;
});

const save = (setup: Partial<Setup>) => emit("save", setup);

const deleteSetup = (setupNumber: number) => {
    hideSetup(setupNumber);
    emit("deleteSetup");
};

const hideSetup = (setupNumber: number) => emit("hideSetup", setupNumber);

watchEffect(() => {
    console.log("setup.value.operation", setup.value.operation);
});
</script>

<style scoped lang="sass">
//.devices
//    padding: min(1rem, 16 / 1024 * 100vw)

.v-card-text.setup-create-content
    padding-inline: min(24px, 24 / 1024 * 100vw)
</style>
