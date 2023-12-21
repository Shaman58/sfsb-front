<template>
    <v-dialog v-model="props.visible" width="800" persistent>
        <v-form ref="form" v-model="valid" @submit.prevent="save(order)" style="height: 800px; overflow-y: auto;">
            <v-card>
                <v-card-text>
                    <h2>Заявка</h2>
                    <div style="margin-top: 1rem;" v-if="props.order && props.order.user"> Автор:
                        <strong>{{ props.order.user.lastName }}</strong>&nbsp;
                        <strong>{{ props.order.user.firstName }}</strong>
                    </div>
                </v-card-text>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="3">
                                <v-text-field label="Номер заявки:" v-model="order.applicationNumber"
                                    :rules="[rules.required]" maxlength="5"></v-text-field>
                            </v-col>
                            <v-col cols="9">
                                <v-select v-if="customers" :items="customers" :item-title="'companyName'" return-object
                                    v-model="order.customer" :rules="[rules.required]"
                                    @update:modelValue="order.contact = null" label="Заказчик">
                                </v-select>
                            </v-col>



                            <v-row v-if="order.id">

                                <v-col cols="12" v-for="(item, index) in order.items" :key="index">
                                    <item-card :item="item" :active="active" :index="index"
                                        @save="replaceItem($event, index)" @hide="active = -1"
                                        @setActive="setActive($event)" @remove="deleteItem(index)"
                                        :class="getBackgroundColorClass(item)" />
                                </v-col>
                                <v-col cols="12">
                                    <item-card :item="{ technology: { outsourcedCosts: { amount: 0, currency: 'RUB' } } }"
                                        :active="active" :index="'new'" @save="addItem($event)" @hide="active = -1"
                                        @setActive="setActive($event)" />
                                </v-col>

                            </v-row>

                            <v-col cols="12">
                                <v-textarea label="Название" v-model="order.description" :rules="[rules.required]">
                                </v-textarea>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea label="КП" v-model="order.businessProposal" :rules="[rules.required]">
                                </v-textarea>
                            </v-col>
                            <v-divider />

                            <order-files :order="props.order.id" v-if="props.order.id" />

                        </v-row>
                    </v-container>

                </v-card-text>

            </v-card>
            <v-card-actions class="card-actions">
                <v-btn @click="previewCommerce(order)" :disabled="kpAvailable">компред</v-btn>
                <v-btn @click="previewToolOrder(order, 1, 2)" :disabled="kpAvailable">заявка на инструмент</v-btn>
                <v-btn @click="previewPlan1(order)" :disabled="kpAvailable">План 1</v-btn>
                <v-btn @click="previewPlan2(order)" :disabled="kpAvailable">План 2</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="orange-darken-1" variant="text" @click="hide">
                    Закрыть
                </v-btn>
                <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
                    {{ order.id ? 'Изменить' : 'Создать' }}
                </v-btn>
            </v-card-actions>
        </v-form>
    </v-dialog>

    <AlertDialog ref="alertDialog" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watchEffect } from "vue";
import { useValidationRules } from "@/mixins/FieldValidationRules";
import ItemCard from "@/components/order/ItemCard.vue";
import { useOfferGenerator } from "@/mixins/OfferGenerator";
import OrderFiles from "./OrderFiles.vue";
import keycloakService from "@/plugins/keycloak/service.mjs";
import AlertDialog from "@/components/common/AlertDialog.vue";
import  useCurrentUser  from "@/mixins/CurrentUser"

interface Props {
    order: Order
    customers: Customer[],
    visible: boolean
}

const props = defineProps<Props>();
const emit = defineEmits(["save","hide"]);

const {user} = useCurrentUser()

const alertDialog = ref< typeof AlertDialog | null>(null)


// const store = useStore();
const { rules } = useValidationRules();
const { previewCommerce, previewToolOrder, previewPlan1, previewPlan2 } = useOfferGenerator();

const form = ref(null);
const valid = ref(false);
const active = ref(-1);


const order = ref(JSON.parse(JSON.stringify(props.order)));

const hide = () => {
    order.value = JSON.parse(JSON.stringify(props.order));
    emit("hide");
};

const isSameUser = () => {
    return props.order.user.id === user.value.id;
}



const save = async (data: Order) => {
    if (!isSameUser() && alertDialog.value) {
        try {
            alertDialog.value.show()
            const res = await alertDialog.value.getAnswer()
            console.log("res", res);
        } catch (error) {
            return
        } finally {
            alertDialog.value.hide()
        }
    }
    emit("save", data);
    // saveFiles()
    if (!data.id) {
        emit("hide");
    }

};

const addItem = (data: Item) => {
    order.value.items.push(data);
};

const replaceItem = async (item: Item, index: number) => {
    order.value.items.splice(index, 1, item);
};

const deleteItem = async (index: number) => {
    order.value.items.splice(index, 1);
};

const setActive = (data: number) => {
    active.value = data;
};

const kpAvailable = computed(() => {
    if (order.value.items.length === 0) {
        return true;
    }
    const index = order.value.items.findIndex((item: Item) => item.technology.computed === false);
    return index !== -1;
});

const getBackgroundColorClass = (item: Item) => {
    if (!!item?.technology?.computed && item?.technology?.computed) {
        return 'computed';
    } else {
        return 'not-computed';
    }
};




</script>

<style lang="sass">
.not-computed
    border: 1px solid #ff7b7b
    border-radius: 10px
    margin: 2px


.computed
    border: 1px solid #97ffa0
    border-radius: 10px
    margin: 2px


.card-actions
  background: #fff
  border-radius: 0 0 4px 4px


</style>
