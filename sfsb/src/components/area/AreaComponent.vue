<template>
  <v-container>
    <area-preview-card/>
    <area-list-dialog/>
    <area-create-dialog/>
    <unit-create-dialog/>
    <store-content-dialog/>
  </v-container>
</template>

<script>
import AreaPreviewCard from "@/components/area/AreaPreviewCard.vue";
import AreaListDialog from "@/components/area/AreaListDialog.vue";
import AreaCreateDialog from "@/components/area/AreaCreateDialog.vue";
import UnitCreateDialog from "@/components/unit/UnitCreateDialog.vue";
import StoreContentDialog from "@/components/store/StoreContentDialog.vue";
import MaterialComponent from "@/components/material/MaterialComponent.vue";

export default {
  name: "area-component",
  components: {
    MaterialComponent,
    StoreContentDialog, UnitCreateDialog, AreaListDialog, AreaPreviewCard, AreaCreateDialog},
  mounted() {
    this.$store.dispatch("fetchAllAreaData");
    this.$store.dispatch("fetchWorkpieces");
    this.$store.dispatch("fetchMaterials");
  },
}
</script>
