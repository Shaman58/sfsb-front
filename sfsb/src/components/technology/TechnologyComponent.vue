<template>
  <v-container>
<!--    <technologist-select/>-->
    <technology-list-dialog/>
    <technology-create-dialog/>
  </v-container>
</template>

<script>

import TechnologistSelect from "@/components/technology/TechnologistSelect.vue";
import TechnologyListDialog from "@/components/technology/TechnologyListDialog.vue";
import TechnologyCreateDialog from "@/components/technology/TechnologyCreateDialog.vue";
import WorkpieceCreateDialog from "@/components/workpiece/WorkpieceCreateDialog.vue";

export default {
  name: "technology-component",
  components: {WorkpieceCreateDialog, TechnologyCreateDialog, TechnologyListDialog, TechnologistSelect},
  mounted() {
    this.$store.dispatch("fetchEmployees");
    this.$store.dispatch("fetchMaterials");
    this.$store.dispatch("fetchAllUnits");
    this.$store.dispatch("fetchCutters");
    this.$store.dispatch("fetchMeasurers");
    this.$store.dispatch("fetchToolings");
    this.$store.dispatch("fetchSpecials");
    this.$store.dispatch("fetchAllItemsData");
  },
}
</script>
