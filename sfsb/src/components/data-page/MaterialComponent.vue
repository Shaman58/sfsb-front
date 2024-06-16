<template lang="pug">
    v-form.material-form(ref="form")
        v-card.material-form__card(:loading="currentTool.loading")
            v-card-title.material-form__title {{ local.materialName}}
            v-card-text.material-form__controls
                .material-form__controls-content
                    v-row.material-form__row
                        v-col(cols="12" sm="6" md="4")
                            v-text-field(label="Название:" v-model="local.materialName" :rules="[rules.required, rules.nameValidation]" counter)
                        v-col(cols="12" sm="6" md="4")
                            v-select(label="Выберите вид:" :items="$geometries" item-title="title" item-value="label"
                                v-model="local.geometry" :rules="[rules.required]" )
                        v-col(cols="12" sm="12" md="4")
                            v-text-field(label="Гост на метериал:"  :rules="[rules.required]" v-model="local.gost1")
                    v-row.material-form__row
                        v-col(cols="12"   sm="6" md="4")
                            v-select(label="Выберите плотность:" :items="templates" item-title="materialTypeName"
                                item-value="density" v-model="local.density" )
                        v-col(cols="12"   sm="6" md="4")
                            v-text-field(label="Плотность:" v-model="local.density"
                                :rules="[rules.required, rules.numeric]" )
                        //v-col(cols="12"   sm="6" md="2")
                        //    v-text-field(label="Стоимость килограмма:" v-model="local.price.amount"
                        //        :rules="[rules.required]" type="number")
                        v-col(cols="12"   sm="6" md="4")
                            v-text-field(label="Гост на сортамент:" v-model="local.gost2")

            v-card-actions.material-form__actions
                v-btn.material-form__btn(@click="save") {{ route.params.id==="new" ? "Сохранить" : "Изменить" }}
                v-btn.material-form__btn.material-form__btn_delete(@click="deleteItem") Удалить

    AlertDialog(ref="alertDialog" title="Вы уверены, что хотите удалить?" :text="geom.title + ' ' +  local.materialName" )

</template>
<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import { storeToRefs } from "pinia";
import { useCurrentTool, useMaterialsStore } from "@/pinia-store/tools";
import {onUnmounted, ref, toRefs, toValue, watch} from "vue";
import { useValidationRules } from "@/mixins/FieldValidationRules";
import { useMaterialTemplatesStore } from "@/pinia-store/materialTemplates";
import { Empty } from "@/mixins/Empty";
import AlertDialog from "@/components/common/AlertDialog.vue";
import CONSTS from '@/consts';

const route = useRoute();
const router  = useRouter();

const alertDialog = ref<typeof AlertDialog | undefined>();

const {tools} = storeToRefs(useMaterialsStore())
const {fetchTool} = useMaterialsStore();


const { currentTool } = storeToRefs(useCurrentTool());
const selectedTool = ref(
    (currentTool.value!.list.find((e) => +e.id === +route.params.id) ||
        currentTool.value!.list[0]) as Material
);
const geom = CONSTS.GEOMETRIES.find(e => e.label === selectedTool.value.geometry)

const { rules } = useValidationRules();

const local = ref(Empty.Material());

const {
    density,
    price: {
        value: { amount },
    },
} = toRefs(selectedTool.value);

const { materialTemplates: templates } = storeToRefs(
    useMaterialTemplatesStore()
);
const { fetchMaterialTemplates } = useMaterialTemplatesStore();
!templates.value.length && (await fetchMaterialTemplates());

const { deleteTool } = useMaterialsStore();

const save = async () => {
    const res = {
        ...selectedTool.value,
        ...local.value,
        updated: "",
    } as Material & Tool;
    currentTool.value && (await currentTool.value.save(res));
};

const deleteItem = async () => {
    console.log("delete", selectedTool.value);
    //подтверждение удаления
    try {
        alertDialog.value.show();
        const res = await alertDialog.value.getAnswer();
        console.log("res", res);
        await deleteTool(selectedTool.value);
        //оьновляем экран, показываем пкрвый элменет в Материалах
        const firstItem = toValue(tools.value[0]);
        router.push(`/data/materials/${firstItem.id}`);
    } catch (error) {
        return;
    } finally {
        alertDialog.value.hide();
    }
};

const unwatchLocal = watch([local], () => console.log("local", local.value), {
    deep: true,
});

const unwatchRoute = watch(
    [route],
    () => {
        if (route.params.id === "new") {
            selectedTool.value = Empty.Material() as Material;
        } else {
            selectedTool.value = (currentTool.value!.list.find(
                (e) => +e.id === +route.params.id
            ) || currentTool.value!.list[0]) as Material;
        }

        for (const key in local.value) {
            if (local.value.hasOwnProperty(key)) {
                (local.value as { [K in keyof Material]: any })[
                    key as keyof Material
                ] = selectedTool.value[key as keyof Partial<Material>];
            }
        }
        local.value.price &&
            (local.value.price = {
                ...local.value.price,
                amount: selectedTool.value.price.amount,
            });
    },
    { immediate: true }
);

onUnmounted(() => {
    unwatchLocal();
    unwatchRoute();
});
</script>

<style scoped lang="sass">
.material-form
    &__btn
        &_delete
            background-color: red
            color: white !important

    &__actions
        display: flex
        justify-content: space-between
</style>
