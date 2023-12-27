<template>
    <v-card>
        <v-form ref="form" v-model="valid" @submit.prevent="save(setup)">
            <v-card-title>
                <span class="text-h5">Установка:</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>

                        <v-col cols="4">
                            <v-switch v-model="setup.cooperate" :true-value="true" :false-value="false"
                                :label="setup.cooperate ? 'Кооперация' : 'Не кооперация'">
                            </v-switch>
                        </v-col>
                        <v-col cols="4" v-if="setup?.operation?.operationTimeManagement === 'COMPUTED' && !setup.cooperate">
                            <v-switch v-model="setup.aggregate" :true-value="true" :false-value="false"
                                :label="setup.aggregate ? 'Несколько заготовок' : 'Одна заготовка'">
                            </v-switch>
                        </v-col>
                        <v-col cols="4" v-if="setup?.operation?.operationTimeManagement === 'FULL'
                            && !setup.cooperate
                            && quantityOfPartsFromWorkpiece !== 1
                            && setup.groupAble">
                            <v-switch v-model="setup.group" :true-value="true" :false-value="false"
                                :label="setup.group ? 'С заготовкой' : 'С деталью'">
                            </v-switch>
                        </v-col>
                        <v-col cols="4"
                            v-if="setup?.operation?.operationTimeManagement === 'COMPUTED' && setup.aggregate && !setup.cooperate">
                            <v-text-field label="Количество заготовок за раз" v-model="setup.perTime" type="number"
                                :rules="[rules.numberGreaterThanZero]"></v-text-field>
                        </v-col>

                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <v-text-field label="Номер установки" v-model="setup.setupNumber"
                                :rules="[unitNumberValidationRule, rules.required]">
                            </v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-select label="Название установки" :items="operations" item-title="operationName"
                                return-object v-model="setup.operation" :rules="[rules.required]">
                            </v-select>
                        </v-col>

                        <v-col cols="4" v-if="setup.cooperate">
                            <v-text-field label="Кооперационная цена на деталь" v-model="setup.cooperatePrice.amount"
                                type="number" :rules="[rules.required, rules.numeric, rules.min0Validation]">
                            </v-text-field>
                        </v-col>

                        <v-col cols="4" v-if="setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate
                            || setup?.operation?.operationTimeManagement === 'COMPUTED' && !setup.cooperate
                            || setup?.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY' && !setup.cooperate">
                            <v-text-field label="Время цикла(чч:мм)" v-model="setup.processTime" type="time"
                                :rules="[rules.durationNotZeroValidation]"></v-text-field>
                        </v-col>
                        <v-col cols="4" v-if="setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate">
                            <v-text-field label="Межоперационное время(чч:мм)" v-model="setup.interoperativeTime"
                                type="time" :rules="[rules.durationNotZeroValidation]"></v-text-field>
                        </v-col>
                        <v-col cols="4" v-if="setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate">
                            <v-text-field label="Наладочное время(чч:мм)" v-model="setup.setupTime" type="time"
                                :rules="[rules.durationNotZeroValidation]"></v-text-field>
                        </v-col>

                        <v-col cols="4" v-if="setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate
                            || setup?.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY' && !setup.cooperate">
                            <v-select v-if="!!toolings" :items="toolings" item-title='toolName' return-object
                                v-model="setup.toolings" label="Выбрать оснастку" multiple>
                            </v-select>
                        </v-col>

                        <v-col cols="4" v-if="setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate
                            || setup?.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY' && !setup.cooperate">
                            <v-btn size="small" variant="text" v-if="setup.measureToolItems?.length === 0"
                                @click="measureVisible = true">
                                Меритель
                            </v-btn>
                            <v-list v-else @click="measureVisible = true">
                                <v-list-item v-for="tool in setup.measureToolItems"
                                    :title="tool.tool.toolName + ' ' + tool.tool.description"
                                    :subtitle="tool.amount + 'шт.'" />
                            </v-list>
                            <measure-create-list title="Меритель" :visible="measureVisible" :tools="setup.measureToolItems"
                                @hide="measureVisible = false" />
                        </v-col>

                        <v-col cols="4" v-if="setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate
                            || setup?.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY' && !setup.cooperate">
                            <v-btn size="small" variant="text" v-if="setup.cutterToolItems?.length === 0"
                                @click="cutterVisible = true">
                                Инструмент
                            </v-btn>
                            <v-list v-else @click="cutterVisible = true">
                                <v-list-item v-for="tool in setup.cutterToolItems" :title="tool.tool.toolName"
                                    :subtitle="tool.amount + 'шт.'" />
                            </v-list>
                            <tool-create title="Инструмент" :visible="cutterVisible" :toolItems="setup.cutterToolItems"
                                :tools="cutters" @hide="cutterVisible = false" />
                        </v-col>

                        <v-col cols="4" v-if="setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate
                            || setup?.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY' && !setup.cooperate">
                            <v-btn size="small" variant="text" v-if="setup.specialToolItems?.length === 0"
                                @click="specialVisible = true">
                                Специнструмент
                            </v-btn>
                            <v-list v-else @click="specialVisible = true">
                                <v-list-item v-for="tool in setup.specialToolItems" :title="tool.tool.toolName"
                                    :subtitle="tool.amount + 'шт.'" />
                            </v-list>
                            <tool-create title="Специнструмент" :visible="specialVisible"
                                :toolItems="setup.specialToolItems" :tools="specials" @hide="specialVisible = false" />
                        </v-col>

                        <v-col cols="6" v-if="setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate
                            || setup?.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY' && !setup.cooperate">
                            <v-btn size="small" variant="text" v-if="setup.additionalTools?.length === 0"
                                @click="additionalVisible = true">
                                Приспособление
                            </v-btn>
                            <v-list v-else @click="additionalVisible = true">
                                <v-list-item v-for="tool in setup.additionalTools"
                                    :title="tool.toolName + ' ' + formatWorkpieceData(tool.workpiece)"
                                    :subtitle="tool.amount + 'шт.'" />
                            </v-list>
                            <additional-create :visible="additionalVisible" :additionals="setup.additionalTools"
                                @hide="additionalVisible = false" />
                        </v-col>

                        <v-col cols="12" v-if="setup?.operation?.operationTimeManagement === 'FULL' && !setup.cooperate
                            || setup?.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY' && !setup.cooperate">
                            <v-combobox label="Приспособление" v-model="setup.additionalComments" :items="additionalTexts"
                                class="flex-full-width" density="comfortable" menu-icon=""
                                placeholder="Выберите из списка или введите свой коментарий"
                                prepend-inner-icon="mdi-magnify" hide-details />
                        </v-col>

                        <v-col cols="12"
                            v-if="setup?.operation?.operationTimeManagement === 'COMPUTED' && !setup.cooperate">
                            <v-textarea clearable v-model="setup.text" label="Коментарии">
                            </v-textarea>
                        </v-col>

                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-btn color="orange-darken-1" variant="text" @click="deleteSetup" v-if="isExist">
                    Удалить
                </v-btn>
                <v-btn color="orange-darken-1" variant="text" @click="hideSetup">
                    Закрыть
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
                    {{ isExist ? 'Изменить' : 'Добавить' }}
                </v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useValidationRules } from "@/mixins/FieldValidationRules";
import ToolCreate from "@/components/technology/ToolItemCreate.vue";
import AdditionalCreate from "@/components/technology/AdditionalCreate.vue";
import materialDataFormatting from "@/mixins/MaterialDataFormatting";
import MeasureCreateList from "@/components/technology/MeasureCreateList.vue";
import { useTechnologyStore } from "@/pinia-store/technology";
import { storeToRefs } from 'pinia';

const props = defineProps({
    setup: {
        type: Object,
        default: {
            id: 0,
            setupNumber: Number,
            perTime: 0,
            measureToolItems: [],
            specialToolItems: [],
            cutterToolItems: [],
            toolings: [],
            additionalTools: [],
            cooperate: false,
            aggregate: false,
            operation: {
                operationName: '',
                paymentPerHour: {},
                operationTimeManagement: ''
            },
            additionalComments: ''
        },
        required: true,
    },
    quantityOfPartsFromWorkpiece: {
        type: Number,
        required: false,
        default: 1
    },
    additionalTexts: {
        type: Array,
        required: true
    }
});

const emit = defineEmits();
const setup = reactive(props.setup);
const additionalTexts = reactive(props.additionalTexts);
const store = useStore();
const { rules } = useValidationRules();
const valid = ref(true);
const form = ref(null);
const cutterVisible = ref(false);
const measureVisible = ref(false);
const specialVisible = ref(false);
const additionalVisible = ref(false);
const { formatWorkpieceData } = materialDataFormatting();

const isExist = (!!setup.operation?.operationName);
const specials = computed(() => store.getters.getSpecials);
const cutters = computed(() => store.getters.getCutters);
const toolings = computed(() => store.getters.getToolings);

const { currentItem } = storeToRefs(useTechnologyStore())

const setupNumbers = computed(() => currentItem.value.technology.setups.filter(item => item.setupNumber !== setup.setupNumber).map(obj => obj.setupNumber));
const operations = computed(() => store.getters.getOperations);
const unitNumberValidationRule = rules.unitNumberValidation(setupNumbers);

const save = (setup: Setup) => emit("save", setup);

const deleteSetup = () => {
    hideSetup();
    emit("deleteSetup");
};

const hideSetup = () => emit("hideSetup");

watchEffect(() => console.log("valid", valid.value))

</script>
