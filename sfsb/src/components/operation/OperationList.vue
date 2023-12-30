<template>
    <v-dialog v-model="props.visible" persistent>
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col cols="4">
                        <v-text-field label="Фильтр:" v-model="filter">
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-btn color="orange-lighten-1" variant="text" @click.stop="active = 'setup'">Наладочная
                        </v-btn>

                        <operation-create :operation="setupPrice" :visible="active === 'setup'" @hide="active = -1"
                            @save="save($event)" />
                    </v-col>
                    <v-col>
                        <v-btn color="orange-lighten-1" variant="text" @click.stop="active = 'tech'">Технолог
                        </v-btn>

                        <operation-create :operation="techPrice" :visible="active === 'tech'" @hide="active = -1"
                            @save="save($event)" />
                    </v-col>
                </v-row>
            </v-card-title>
            <v-list>
                <v-list-item v-for="(item, index) in filtered" :key="index" :title="item.operationName"
                    :subtitle="formatOperationData(item.operationTimeManagement)" @click.stop="active = index">

                    <operation-create :operation="item" :visible="active === index" @hide="active = -1" @save="save($event)" />

                </v-list-item>

                <v-list-item :title="'...'">

                    <template v-slot:append>
                        <v-btn color="orange-lighten-1" icon="mdi-plus" variant="text" @click.stop="active = 'new'"></v-btn>
                    </template>

                    <operation-create :operation="{ paymentPerHour: { currency: 'RUB' } }" :visible="active === 'new'"
                        @hide="active = -1" @save="save($event)" />

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
import { useStore } from "vuex";
import useOperationFormatting from "@/mixins/OperationDataFormatting"
import OperationCreate from "@/components/operation/OperationCreate.vue";

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    operations: {
        type: Array,
        required: true
    },
    techPrice: {
        type: Object,
        required: true
    },
    setupPrice: {
        type: Object,
        required: true
    },
});

// const store = useStore();
const emit = defineEmits();
const { formatOperationData } = useOperationFormatting();

const filter = ref(null);
const active = ref(null);

const filtered = computed(() => {
    return props.operations.filter((item) => {
        return (
            (!filter.value || item.operationName.toLowerCase().includes(filter.value.toLowerCase()))
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
