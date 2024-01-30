import {Ref} from "vue";

export function useValidationRules() {
    const rules = ({
        required: <T extends string | number>(value: T) => (!!value) || 'Обязательное поле',
        counter: (value: string) => value.length <= 200 || 'Не более 200 символов',
        emailValidation: (value: string) => {
            const pattern = /^\w+([.-]?\w+){2,}@\w+([.-]?\w+)*(\.\w{2,5})+$/
            return pattern.test(value) || 'Неверный формат'
        },
        phoneValidation: (value: string) => {
            const pattern = /^\+?[78][-(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/
            return pattern.test(value) || 'Неверный формат'
        },
        accountValidation: (value: string) => {
            const pattern = /^[0-9]{20}$/
            return pattern.test(value) || 'Неверный формат, введите 20 цифр'
        },
        accountWithEmptyValidation: (value: string) => {
            const pattern = /^[0-9]{20}$/
            return pattern.test(value) || value === "" || 'Неверный формат, введите 20 цифр'
        },
        bikkppValidation: (value: string) => {
            const pattern = /^[0-9]{9}$/
            return pattern.test(value) || 'Неверный формат, введите 9 цифр'
        },
        bikkppWithEmptyValidation: (value: string) => {
            const pattern = /^[0-9]{9}$/
            return pattern.test(value) || value === "" || 'Неверный формат, введите 9 цифр'
        },
        ogrnValidation: (value: string) => {
            const pattern = /^[0-9]{13}$/
            return pattern.test(value) || 'Неверный формат, введите 13 цифр'
        },
        innValidation: (value: string) => {
            const pattern = /^[0-9]{10}$/
            return pattern.test(value) || 'Неверный формат, введите 10 цифр'
        },
        nameValidation: (value: string) => value.length >= 3 || "Минимальное количество символов: 3",
        durationNotZeroValidation: (value: string) => value !== '00:00' || 'Продолжительность не должна быть равна "00:00"',
        numberGreaterThanZero: (value: number) => value > 0 || 'Значение должно быть больше нуля',
        unitNumberValidation: (setupNumbers: Ref<number[]>) => (value: string) => {
            const pattern = /^[0-9]{1,5}$/;
            const isUnique = !setupNumbers.value.includes(Number(value));
            return pattern.test(value) && isUnique || 'Неверный формат или число уже присутствует в массиве';
        },
        numberValidate: (value: string) => {
            const pattern = /^[0-9]{1,5}$/
            return pattern.test(value) || 'Неверный формат, введите 1-5 цифр'
        },
        numeric: (value: number) => (value === 0 || !isNaN(value)) || "Введите число",
        minValidation: (value: number) => value > 0 || "Число должно быть больше 0",
        min0Validation: (value: number) => value >= 0 || "Число должно быть больше или равно 0",
        geom2LessThanGeom1: (workpiece: Workpiece) => () => {
            if (workpiece.geom1 !== null && workpiece.geom2 !== null && parseFloat(workpiece.geom2) >= parseFloat(workpiece.geom1)) {
                return "Внутренний диаметр должен быть меньше внешнего диаметра";
            }
            return true;
        },
    });

    return {rules};
}
