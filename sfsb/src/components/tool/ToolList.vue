<template lang="pug">
    v-dialog(v-model="props.visible")
        v-card
            template(#loader)
                v-progress-linear(:active="props.loading" color="orange" height="4" indeterminate="true")
            v-card-title
                v-row
                    v-col(cols="4")
                        v-text-field(label="Фильтр:" v-model="filter")
            v-list
                v-list-item(v-for="(item, index) in filtered||[]" :key="item.id" :title="item && item.toolName" :subtitle="item && item.description" @click.stop="index !== null && (active = index)")
                    tool-template-create(:tool="item" :visible="active === index" @hide="active = -1" @save="save($event)")
                v-list-item(:title="'...'")
                    template(#append)
                        v-btn(color="orange-lighten-1" icon="mdi-plus" variant="text" @click.stop="active = 'new'")
                    tool-template-create(:tool="{}" :visible="active === 'new'" @hide="active = -1" @save="save($event)")

            v-card-actions
                v-spacer
                v-btn(color="orange-darken-1" variant="text" @click="hide") Закрыть
</template>

<script setup lang="ts">
import {computed, type Ref, ref} from "vue";
import ToolTemplateCreate from "@/components/tool/ToolCreate.vue";

interface Props {
    visible: boolean
    tools: Tool[]
    loading: boolean
}

const props = defineProps<Props>();

const emit = defineEmits(["remove", "hide", "save"]);

const filter: Ref<string | null> = ref(null);
const active: Ref<number | string | null> = ref(null);

const filtered = computed(() => {
    return props.tools.filter((item) => {
        return (
            (!filter.value || item.toolName.toLowerCase().includes(filter.value.toLowerCase()))
        );
    });
});

const remove = ((data: Tool) => {
    emit("remove", data);
});

const hide = (() => {
    emit("hide");
});

const save = (data: Tool) => {
    emit("save", data);
};

</script>
