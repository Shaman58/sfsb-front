<template lang="pug">

    v-menu.resource-info(
        v-model="menu"
        :close-on-content-click="false"
        location="end"
        scroll-strategy="reposition"
        transition="slide-y-transition"

        :style="{left: '50%', translate: '-50% 0', maxWidth: '520px'}"
    )
        v-icon.close(@click="menu = false", icon="$close", color="orange" )
        div.content
            div Наименование: &nbsp;
                strong {{resource.name}}
            ul.tasks
                li.task(v-for="task in resource.tasks", :key="task.id") {{JSON.stringify(task,null,2)}}

</template>

<script setup lang="ts">
const props = defineProps<{ resource: Resource | undefined }>();
const menu = defineModel<boolean>("menu");
</script>

<style scoped lang="sass">
.resource-info
    position: absolute
    z-index: 3
    max-height: 70svh
    padding: 1rem
    background: #fff
    border-radius: 0.5rem
    container: recource-info / size

    & > .v-overlay__content
        width: 100%

.close
    position: absolute
    z-index: 1
    top: 0.5rem
    right: 0.5rem

.content
    width: 100cqw

.tasks
    margin-top: 1rem
    height: 83cqh
    overflow: auto

.task
    padding: 0.5em

    &:nth-child(even)
        background: #eee
</style>
