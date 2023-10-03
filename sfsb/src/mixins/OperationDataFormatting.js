import {ref} from 'vue';

export default function useOperationFormatting() {
  const operations = ref([
    {title: 'Станочная', label: 'FULL'},
    {title: 'Ручная', label: 'PROCESS_TIME_ONLY'},
    {title: 'Вычисляемая(термичка)', label: 'COMPUTED'},
    {title: 'Без вычислений', label: 'NONE'},
  ]);

  const formatOperationData = (data) => {
    switch (data) {
      case 'FULL':
        return `Станочная`;
      case 'PROCESS_TIME_ONLY':
        return `Ручная`;
      case 'COMPUTED':
        return `Вычисляемая(термичка)`;
      case 'NONE':
        return `Без вычислений`;
      default:
        break;
    }

    return '';
  };

  return {operations, formatOperationData};
}
