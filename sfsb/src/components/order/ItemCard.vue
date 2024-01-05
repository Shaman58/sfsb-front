<template>
    <v-card v-if="props.active!==props.index"
            @click.stop="setActive"
            style="height: 48px;">
        <v-card-subtitle class="d-flex justify-space-between align-center">
            <div class="item-card-indicators">
                <v-icon v-if="Object.keys(item.technology).length !== 1"
                        :color="colorOfComputed">mdi-alarm-panel-outline
                </v-icon>
                <v-icon v-if="Object.keys(item.technology).length !== 1"
                        :color="colorOfWorkpiece">
                    mdi-flask-empty
                </v-icon>
            </div>
            {{
                Object.keys(item.technology).length === 1
                    ? 'Добавить позицию'
                    : item.technology.value.drawingNumber + ' ' + item.technology.value.drawingName
            }}
            <v-icon v-if="item.customerMaterial"
                    color="green">mdi-playlist-minus
            </v-icon>
            <a v-if="Object.keys(item.technology).length !== 1"
               class="ml-auto">{{ item.quantity + ' шт.' }}</a>
            <v-btn v-if="Object.keys(item.technology).length !== 1"
                   icon @click.stop="remove"
                   color="orange-darken-1" variant="text">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-subtitle>
    </v-card>
    <v-card v-else>
        <v-form ref="form"
                v-model="valid"
                v-on:submit.prevent="save()">

            <v-row>
                <v-col cols="4">
                    <v-text-field label="Номер чертежа:"
                                  v-model="item.technology.value.drawingNumber"
                                  :rules="[rules.required, rules.counter]"
                                  maxlength="20"
                                  :disabled="!!item.technology.value.id"
                    ></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Название чертежа:"
                                  v-model="item.technology.value.drawingName"
                                  :rules="[rules.required, rules.counter]"
                                  maxlength="20"
                                  :disabled="!!item.technology.value.id"
                    ></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Количество:"
                                  v-model="item.quantity"
                                  :rules="[rules.required, rules.numberValidate]"
                                  type="number"
                    ></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-switch v-model="item.customerMaterial"
                              :true-value="true"
                              :false-value="false"
                              :label="item.customerMaterial ? 'Материал заказчика' : 'Наш материал'">
                    </v-switch>
                </v-col>
                <v-spacer/>
                <v-col cols="5">
                    <v-btn :disabled="!valid"
                           @click="save"
                           color="orange-darken-1" variant="text">
                        {{  item.id ? 'Изменить' : 'Добавить' }}
                    </v-btn>
                    <v-btn @click="hide"
                           color="orange-darken-1" variant="text">
                        закрыть
                    </v-btn>
                </v-col>
            </v-row>

        </v-form>
    </v-card>
</template>

<script setup lang="ts">
import {computed, ref, Ref, toRefs} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";

interface Props{
    item: Item
    active: number|string
    index: number|string
}
const props = defineProps<Props>()

const form: Ref<HTMLFormElement | null> = ref(null);
const valid = ref(false);
const {rules} = useValidationRules();
const emit = defineEmits();
// const item = ref(JSON.parse(JSON.stringify(props.item)));
const item = toRefs(props.item)

// watch(() => props.item, (newValue) => {
//     item.value = JSON.parse(JSON.stringify(newValue));
// });

const save = async () => {
    if (form.value?.validate()) {
        item.technology.value.computed = false;
        emit("save", item);
        hide();
    }
}

const remove = async () => emit("remove");

const hide = () => {
    // item.value = JSON.parse(JSON.stringify(props.item));
    emit("hide");
};

const setActive = () => emit("setActive", props.index);

const wasDefinedComputedAndWorkpiece = computed(() => item.technology.value.computed && !!item.technology.value.workpiece && !!item.technology.value.workpiece.material
    && !!item.technology.value.workpiece.material.price?.amount)

const colorOfComputed = computed(() => {
    if(wasDefinedComputedAndWorkpiece.value) return 'green'
    if(item.technology.value.computed) return 'red'
    return '#777'
})
const colorOfWorkpiece = computed(() => {
    if(wasDefinedComputedAndWorkpiece.value) return 'green'
    if(!!item.technology.value.workpiece?.material?.price?.amount) return 'red'
    return '#777'
})
</script>



<style scoped lang="sass">
.item-card-indicators
    width: 60px
    display: flex
    gap: .5rem

</style>
