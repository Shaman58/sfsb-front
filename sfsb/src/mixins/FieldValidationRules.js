export function useValidationRules() {
  const rules = ({
    required: value => !!value || 'Обязательное поле',
    counter: value => value.length <= 200 || 'Не более 200 символов',
    emailValidation: value => {
      const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
      return pattern.test(value) || 'Неверный формат'
    },
    phoneValidation: value => {
      const pattern = /^\+?[78][-(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/
      return pattern.test(value) || 'Неверный формат'
    },
    accountValidation: value => {
      const pattern = /^[0-9]{20}$/
      return pattern.test(value) || 'Неверный формат, введите 20 цифр'
    },
    bikkppValidation: value => {
      const pattern = /^[0-9]{9}$/
      return pattern.test(value) || 'Неверный формат, введите 9 цифр'
    },
    ogrnValidation: value => {
      const pattern = /^[0-9]{13}$/
      return pattern.test(value) || 'Неверный формат, введите 13 цифр'
    },
    innValidation: value => {
      const pattern = /^[0-9]{10}$/
      return pattern.test(value) || 'Неверный формат, введите 10 цифр'
    },
    nameValidation: (value) => value.length >= 3 || "Минимальное количество символов: 3",
    durationNotZeroValidation: value => value !== '00:00' || 'Продолжительность не должна быть равна "00:00"',
    numberGreaterThanZero: value => value > 0 || 'Значение должно быть больше нуля',
    unitNumberValidation: (setupNumbers) => (value) => {
      const pattern = /^[0-9]{1,5}$/;
      const isUnique = !setupNumbers.value.includes(Number(value));
      return pattern.test(value) && isUnique || 'Неверный формат или число уже присутствует в массиве';
    },
    numberValidate: value => {
      const pattern = /^[0-9]{1,5}$/
      return pattern.test(value) || 'Неверный формат, введите 1-5 цифр'
    },
    numeric: (value) => !isNaN(value) || "Введите число",
    minValidation: (value) => value > 0 || "Число должно быть больше 0",
    geom2LessThanGeom1: (workpiece) => () => {
      if (workpiece.geom1 !== null && workpiece.geom2 !== null && parseFloat(workpiece.geom2) >= parseFloat(workpiece.geom1)) {
        return "Внутренний диаметр должен быть меньше внешнего диаметра";
      }
      return true;
    },
  });

  return {rules};
}
