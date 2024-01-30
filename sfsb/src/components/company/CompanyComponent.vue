<template>
    <v-container>
        <router-link :to="'/company'">
            <company-preview-card :company="company" @click.stop="visible = true"/>
        </router-link>
        <!-- <company-create-dialog v-if="company.id"
                           :company="company"
                           :visible="visible"
                           @hide="visible=false"
                           @save="save($event)"
    /> -->
    </v-container>
</template>

<script setup>
import CompanyPreviewCard from "@/components/company/CompanyPreviewCard.vue";
import CompanyCreateDialog from "@/components/customer/CompanyCreateDialog.vue";
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";

const store = useStore();

onMounted(() => {
    store.dispatch("fetchCompanyData");
});

const company = computed(() => store.getters.getCompany);
const visible = ref(false);

const save = (data) => {
    store.dispatch("saveCompany", data);
};

</script>
