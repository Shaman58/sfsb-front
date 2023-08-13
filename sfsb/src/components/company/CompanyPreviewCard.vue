<template>
  <v-card class="mx-auto" max-width="344" variant="outlined">
    <v-card-item>
      <div v-if="isCompanyCreated">
        <div class="text-overline mb-1">
          {{ company.email }}
          <br>
          {{ company.phoneNumber }}
        </div>
        <div class="text-h6 mb-1">
          {{ company.companyName }}
        </div>
        <div class="text-caption">{{ company.address }}</div>
      </div>
      <div v-else>
        <div class="text-overline mb-1">
          Компания отсутствует
        </div>
      </div>
      <v-card-actions>
        <v-row justify="center">
          <v-btn color="primary" variant="outlined" :disabled="!isCompanyCreated" @click="showCompanyDialog()">
            Изменить
          </v-btn>
          <v-btn color="primary" variant="outlined" :disabled="isCompanyCreated" @click="showCompanyDialog()">
            Создать
          </v-btn>
        </v-row>
      </v-card-actions>
    </v-card-item>
  </v-card>
</template>

<script>
import {useStore} from "vuex";
import {computed} from "vue";

export default {
  name: "company-preview-card",
  setup() {
    const store = useStore();

    const company = computed(() => store.getters.getCompany);
    const isCompanyCreated = computed(() => !!company.value.id);

    const showCompanyDialog = () => {
      store.commit("setSelectedCompany", company.value)
      store.commit("setCompanyDialog", true);
    };

    return {
      showCompanyDialog,
      company,
      isCompanyCreated
    }
  }
}
</script>
