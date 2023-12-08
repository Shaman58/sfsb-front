<template>
  <v-container>
    <v-card persistent>
      <v-card-title>
        <span class="text-h5">Технологии на просчет:</span>
      </v-card-title>
      <v-text-field clearable label="Найти" v-model="filterText"></v-text-field>
      <v-row class="list-dialog">
        <v-list density="compact">
          <v-list-item v-for="(order, idx) in filteredOrders" :key="order.id" :value="order"
            :title="`${order.applicationNumber} ${order.description}`" @click="setCurrentOrder(order.id)">
          </v-list-item>
        </v-list>
        <v-list>
          <v-list-item v-for="item in items" key="item.id">
            <div v-for="i in item" class="item-row" @click="showTechnologyCreateDialog(i)">
              <v-icon>{{ i.technology.computed ? "mdi-star" : "mdi-arm-flex" }}</v-icon>
              <span>{{ i.technology.drawingName }}</span>
              <span>{{ i.technology.drawingNumber }}</span>
            </div>
          </v-list-item>
        </v-list>
      </v-row>
    </v-card>
    <v-card>

    </v-card>


  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watchEffect, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const filterText = ref("")

onMounted(() => {
  store.dispatch('fetchOrders')
})

const currentOrder = ref(0)

const filteredOrders = computed(() => orders.value.filter((e: Order) => {
  if (!filterText.value) return true


  const isIncludesInOrderId = !!e.applicationNumber.toString().includes(filterText.value.toLowerCase())
  const isIncludesInDrawingName = !!e.items.filter(e => e.technology.drawingName.toLowerCase().includes(filterText.value.toLowerCase())).length
  const isIncludesInDrawingNumber = !!e.items.filter(e => e.technology.drawingNumber.toString().includes(filterText.value.toLowerCase())).length
  return isIncludesInOrderId
    || isIncludesInDrawingName
    || isIncludesInDrawingNumber

}))

const orders = computed<Order[]>(() => store.getters.getOrders);


const items = computed(() => orders.value && orders.value.filter((e: Order) => e.id === currentOrder.value).map((e: Order) => e.items))

const showTechnologyCreateDialog = (item: Item) => {
  store.commit('setItem', item);
  store.commit('setTechnologyDialogVisible', true);
};


const setCurrentOrder = (x: number) => {
  currentOrder.value = x
}

watch(()=>orders.value,()=> currentOrder.value = orders.value[0].id)
watch(()=> filteredOrders.value, ()=>setCurrentOrder(filteredOrders.value[0].id))


</script>

<style scoped lang="sass">
.item-row
  display: flex
  gap: 1rem
.list-dialog
    gap: 1rem
    & > *
      flex: 1 1 calc(50% - 1rem)

</style>
