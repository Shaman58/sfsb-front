<template>
    <v-dialog v-model="props.visible" persistent>
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col cols="4">
                        <v-text-field label="Фильтр:" v-model="filter">
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-list>
                <v-list-item v-for="(item, index) in filtered" :key="index" :title="item.toolName"
                    :subtitle="item.description" @click.stop="active = index">



                    <tool-template-create :tool="item" :visible="active === index" @hide="active = -1" @save="save($event)" />

                </v-list-item>

                <v-list-item :title="'...'">

                    <template v-slot:append>
                        <v-btn color="orange-lighten-1" icon="mdi-plus" variant="text" @click.stop="active = 'new'" />
                    </template>

                    <tool-template-create :tool="{}" :visible="active === 'new'" @hide="active = -1" @save="save($event)" />

                </v-list-item>
            </v-list>

            <v-card-actions>
                <v-spacer />
                <v-btn color="orange-darken-1" variant="text" @click="hide">
                    Закрыть
                </v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, ref } from "vue";
import ToolTemplateCreate from "@/components/tool/ToolCreate.vue";

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    tools: {
        type: Array,
        required: true
    },
});

const emit = defineEmits();

const filter = ref(null);
const active = ref(null);

const filtered = computed(() => {
    return props.tools.filter((item) => {
        return (
            (!filter.value || item.toolName.toLowerCase().includes(filter.value.toLowerCase()))
        );
    });
});

const remove = ((data) => {
    emit("remove", data);
});

const hide = (() => {
    emit("hide");
});

const save = (data) => {
    emit("save", data);
};

</script>
