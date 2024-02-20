<template>
    <div class="operation-descriptions">
            <v-card class="operation-descriptions__card">
                Станочная - применяется для назначения машинных операций с временем <a class="text-cyan">операции</a>,
                <a class="text-cyan">наладки</a> и
                <a class="text-cyan">межоперационки</a>
            </v-card>
            <v-card class="operation-descriptions__card">
                Ручная - применяется для назначения ручных операций с временем <a class="text-cyan">операции</a> БЕЗ <a
                class="text-red">наладки</a> и
                <a class="text-red">межоперационки</a>
            </v-card>
            <v-card class="operation-descriptions__card">Вычисляемая - применяется для назначения операции с временем <a class="text-cyan">операции</a> и
                возможностью обработки по
                <a class="text-cyan">несколько ЗАГОТОВОК</a>
            </v-card>
    </div>
</template>

<script setup lang="ts">

</script>

<style  lang="sass">
.operation-descriptions
    display: flex
    gap: 2vw

    @media (width < 1024px)
        flex-direction: column

    &__card
        padding: 1vw

</style>
