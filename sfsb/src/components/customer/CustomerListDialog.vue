<template lang="pug">
    div
        v-dialog(v-model="visibleLocal" width="800")
            v-card(title="Контрагенты:")
                v-list
                    v-list-item(v-for="item in customers" :key="item.id" :title="item.companyName" @click.stop="setActiveItem(item)")
                        //CompanyCreateDialog(:visible="activeItem !== null" :company="item" @hide="activeItem=null" @save="save($event)" @remove="remove($event)")

                    v-list-item(title="...")
                        template(#append)
                            v-btn(color="orange-lighten-1" icon="mdi-plus" variant="text" @click.stop="setActiveItem('new')")
                        //CompanyCreateDialog(:visible="active === 'new'" :company="{}" @hide="active = -1" @save="save($event)" @remove="remove($event)")

                v-card-actions
                    v-spacer
                    v-btn(color="orange-darken-1" variant="text" @click="hide") Закрыть
            //TestComponent(:visible="activeItem !== null" :company="activeItem" )
            CompanyCreateDialog(v-model:show="showCompanyCreateDialog" :company="activeItem"  @save="save($event)")
</template>

<script setup lang="ts">
import {type Ref, ref, toRef, toRefs} from "vue";
import CompanyCreateDialog from "@/components/company/CompanyCreateDialog.vue";

const props = defineProps<{ customers: Customer[], visible: boolean }>();
const {customers, visible} = toRefs(props)

const showCompanyCreateDialog = ref(false)

const newCustomer: Partial<Customer> = {
    bik: "",
    bank: "",
    address: "",
    inn: "",
    kpp: "",
    companyName: "",
    contacts: [],
    ogrn: "",
    email: "",
    correspondentAccount: "",
    paymentAccount: "",
    phoneNumber: ""
}

const emit = defineEmits(["remove", "hide", "save"]);
const active: Ref<null | number | string> = ref(null);
const visibleLocal = toRef(visible)

const activeItem: Ref<null | Partial<Customer>> = ref(null)

const setActiveItem = (item: Customer | 'new') => {
    activeItem.value = item === 'new' ? newCustomer : item
    showCompanyCreateDialog.value = true
}

const remove = (data: Customer) => {
    emit("remove", data);
};

const hide = () => {
    emit("hide");
};

const save = (data: Customer) => {
    emit("save", data);
};

</script>
