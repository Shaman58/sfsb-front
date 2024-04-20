<template lang="pug">
    div.phone-number(role="list")
        v-combobox(
            v-model="selectedCountry"
            :items="countries"
            item-title="name"
            item-value="code"
            label="Выберите страну"
            return-object
        )

        v-text-field(
            v-mask="'(###)###-##-##'"

            v-model="selectedNumber"
            placeholder="(987)654-32-10"

        )
        .phone-number__total {{modelValue}}
        .to-delete {{modelValue}}

</template>
<script setup lang="ts">
import { computed, watchEffect } from "vue";
import useCountries from "@/pinia-store/countries";

const modelValue = defineModel<string>();
const digitize = (num: string) => num.replace(/\D/g, "");
const splitter = (num: string): [string, string] => {
    const digits = digitize(num);
    const first = digitize(selectedCountry.value.dial_code);
    const second =
        digits.length <= first.length
            ? ""
            : digits.slice(-1 * (digits.length - first.length));
    return [first, second];
};
const splitedNumber = computed<{ country?: string; localNumber?: string }>(
    () => {
        if (!modelValue.value)
            return { country: undefined, localNumber: undefined };
        const [country, localNumber] = splitter(modelValue.value);
        return {
            country,
            localNumber,
        };
    }
);
const { countries, getCountryByDialCode, getCountryByCode } = useCountries();

const selectedCountry = computed<CountryCode>({
    get() {
        return (
            getCountryByDialCode(splitedNumber.value.country || "") ||
            getCountryByCode("RU")!
        );
    },
    set(value: CountryCode) {
        modelValue.value = value.dial_code + selectedNumber.value;
    },
});
const selectedNumber = computed({
    get() {
        return splitedNumber.value.localNumber || "";
    },
    set(value: string) {
        modelValue.value = selectedCountry.value.dial_code + value;
    },
});
const rulesWidth = (length: number) => (value: string) =>
    value.length >= length || "Неверный номер";

watchEffect(() => console.log("modelValue.value", modelValue.value));
watchEffect(() => console.log("selectedCountry.value", selectedCountry.value));
watchEffect(() => {
    console.log(
        "selectedNumber.value",
        selectedNumber.value.replace(/\W/g, "").match(/^9/g)
    );
});
</script>

<style scoped lang="sass">
.phone-number
    display: grid
    gap: 0.5rem
    grid-template-columns: 1fr 2fr
    grid-template-rows: auto 20px

    &__total
        text-align: center
        opacity: .5
        grid-column: span 2
</style>
