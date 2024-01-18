<template lang="pug">
    v-dialog(v-model="visibleLocal" width="800")
        v-card(title="Контрагенты:")
            v-list
                v-list-item(v-for="(item, index) in customers" :key="index" :title="item.companyName" @click.stop="active=index")
                    CompanyCreateDialog(:visible="active === index" :company="item" @hide="active = -1" @save="save($event)" @remove="remove($event)")

                v-list-item(title="...")
                    template(#append)
                        v-btn(color="orange-lighten-1" icon="mdi-plus" variant="text" @click.stop="active = 'new'")
                    CompanyCreateDialog(:visible="active === 'new'" :company="{}" @hide="active = -1" @save="save($event)" @remove="remove($event)")

            v-card-actions
                v-spacer
                v-btn(color="orange-darken-1" variant="text" @click="hide") Закрыть

</template>

<script setup lang="ts">
import {type Ref, ref, toRef} from "vue";
import CompanyCreateDialog from "@/components/company/CompanyCreateDialog.vue";

const {customers, visible} = defineProps<{ customers: Customer[], visible: boolean }>();

const emit = defineEmits(["remove", "hide", "save"]);
const active: Ref<null | number | string> = ref(null);
const visibleLocal = toRef(visible)

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
