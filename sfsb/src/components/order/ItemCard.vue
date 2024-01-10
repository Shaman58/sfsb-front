<template>
    <v-card v-if="props.active!==props.index"
            @click.stop="setActive"
            style="height: 48px;">
        <v-card-subtitle class="d-flex justify-space-between align-center">
            <div class="item-card-indicators">
                <v-icon v-if="Object.keys(item.technology).length !== 1"
                        :color="item.technology.computed ? 'green':'grey'">mdi-alarm-panel-outline
                </v-icon>
                <v-icon v-if="Object.keys(item.technology).length !== 1"
                        :color="!!item.customerMaterial || !!item.technology.assembly || !!item.technology.workpiece?.material?.price?.amount ? 'green':'grey' ">
                    mdi-flask-empty
                </v-icon>

            </div>
            {{
                Object.keys(item.technology).length === 1
                    ? 'Добавить позицию'
                    : item.technology.drawingNumber + ' ' + item.technology.drawingName
            }}
            <span>{{ props.index }}</span>
            <span v-if="Object.keys(item.technology).length !== 1"
               class="ml-auto">{{ item.quantity + ' шт.' }}</span>
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
                                  v-model="item.technology.drawingNumber"
                                  :rules="[rules.required, rules.counter]"
                                  maxlength="20"
                                  :disabled="!!item.technology.id"
                    ></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Название чертежа:"
                                  v-model="item.technology.drawingName"
                                  :rules="[rules.required, rules.counter]"
                                  maxlength="20"
                                  :disabled="!!item.technology.id"
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
                        {{  item.id || item.uid ? 'Изменить' : 'Добавить' }}
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
import {computed, onMounted, reactive, ref, Ref, toRefs, watch, toRaw} from "vue";
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
const emit = defineEmits(["save","remove","hide","setActive"]);
// const item = ref(JSON.parse(JSON.stringify(props.item)));
const emptyItem =()=> ({ technology: { outsourcedCosts: { amount: 0, currency: 'RUB' } }, customerMaterial:false } as Item)

let item = props.item ? reactive(props.item) : reactive(emptyItem())

const save = async () => {
    if (form.value?.validate()) {
        // item.technology.computed = false;
        emit("save", {...toRaw(item)});
        hide();
        // item = reactive({ } as Item)
    }
}

const remove = async () => emit("remove");

const hide = () => {
    // item.value = JSON.parse(JSON.stringify(props.item));
    emit("hide");
    item = props.item ? reactive(props.item) : reactive(emptyItem())
};

const setActive = () => emit("setActive", props.index);

const wasDefinedComputedAndWorkpiece = computed(() => item.technology.computed && !!item.technology.workpiece && !!item.technology.workpiece.material
    && !!item.technology.workpiece.material.price?.amount)


</script>



<style scoped lang="sass">
.item-card-indicators
    width: 60px
    display: flex
    gap: .5rem

</style>
