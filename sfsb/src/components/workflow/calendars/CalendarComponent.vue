<template lang="pug">
    LayoutPage.users(:background="'#7757e069'")
        template(#title) Календари
        template(#filter)
            v-text-field(label="фильтр" v-model="filterText" clearable)
        template(#list)
            //suspended-component
                //technology-list(:filter="filterText")
            v-list
                v-list-item
                    v-list-item-title
                        router-link.list-link(:to="`/commerce/clients/new`")
                            div(:style="{color: 'orange'}") Добавить новую компанию
                v-list-item(
                    v-for="calendar in calendars"
                    :key="calendar.id"
                )
                    v-list-item-title
                        router-link.list-link(:to="`/workflow/calendars/${calendar.id}`") {{calendar.description || calendar.calendarName}}

        template(#card)
            suspended-component
                router-view

</template>

<script setup lang="ts">

import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import LayoutPage from "@/components/common/LayoutPage.vue";
import {onMounted, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useCalendars} from "@/pinia-store/calendar";

const filterText = ref("");

const {calendars} = storeToRefs(useCalendars());
const {getCalendars} = useCalendars()

onMounted(async() => {
    await getCalendars();
})


</script>


<style scoped lang="sass">

</style>
