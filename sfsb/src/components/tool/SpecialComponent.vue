<template lang="pug">
    v-btn(@click.stop="visible=true" color="orange-darken-1" variant="text") Редактировать базу специнструмента
    tool-list(v-if="specials && specials.length" :visible="visible" :tools="specials" :loading="loading" @hide="visible=false" @save="save" @remove="remove")

</template>

<script setup lang="ts">
import {ref} from "vue";
import ToolList from "@/components/tool/ToolList.vue";
import {storeToRefs} from "pinia";
import {useSpecialStore} from "@/pinia-store/specials";

const {specials, loading} = storeToRefs(useSpecialStore())
const {fetchSpecials, deleteSpecial, saveSpecial} = useSpecialStore()

await fetchSpecials()

const visible = ref(false)
const save = async (data: Tool) => await saveSpecial(data)
const remove = async (data: Tool) => await deleteSpecial(data)


</script>
