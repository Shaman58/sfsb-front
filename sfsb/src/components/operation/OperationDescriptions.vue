<template>
    <v-row>
        <v-col cols="4">
            <v-card>
                Станочная - применяется для назначения машинных операций с временем <a class="text-cyan">операции</a>,
                <a class="text-cyan">наладки</a> и
                <a class="text-cyan">межоперационки</a>
            </v-card>
        </v-col>
        <v-col cols="4">
            <v-card>
                Ручная - применяется для назначения ручных операций с временем <a class="text-cyan">операции</a> БЕЗ <a
                class="text-red">наладки</a> и
                <a class="text-red">межоперационки</a>
            </v-card>
        </v-col>
        <v-col cols="4">
            <v-card>Вычисляемая - применяется для назначения операции с временем <a class="text-cyan">операции</a> и
                возможностью обработки по
                <a class="text-cyan">несколько ЗАГОТОВОК</a>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">

</script>

<style scoped lang="sass">

</style>
