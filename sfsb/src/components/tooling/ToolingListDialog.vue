<template>
  <v-dialog v-model="isVisible" persistent>
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="4">
            <v-text-field
              label="Фильтр:"
              v-model="filter">
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-list>
        <v-list-item
          v-for="item in filtered"
          :key="item.id"
          :title="item.toolName"
          :subtitle="item.description"
          @click.stop="showDialog(item)">

          <template v-slot:append>
            <v-btn
              color="orange-lighten-1"
              icon="mdi-delete"
              variant="text"
              @click.stop="remove(item)"
            ></v-btn>
          </template>

        </v-list-item>

        <v-list-item :title="'...'">

          <template v-slot:append>
            <v-btn
              color="orange-lighten-1"
              icon="mdi-plus"
              variant="text"
              @click.stop="showDialog({})"
            ></v-btn>
          </template>

        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="orange-darken-1"
          variant="text"
          @click="hide">
          Закрыть
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script setup>
import {computed, ref} from "vue";
import {useStore} from "vuex";

const store = useStore();

const filter = ref(null);

const isVisible = computed(() => store.getters.getToolingListVisible);
const toolings = computed(() => store.getters.getToolings);

const remove = ((item) => {
  store.dispatch("deleteTooling", item);
});

const hide = (() => {
  store.commit("setToolingListVisible", false)
});

const showDialog = ((item) => {
  store.commit("setTooling", {...item});
  store.commit("setToolingDialogVisible", true);
});

const filtered = computed(() => {
  return toolings.value.filter((item) => {
    return (
      (!filter.value || item.toolName.toLowerCase().includes(filter.value.toLowerCase()))
    );
  });
});

</script>
