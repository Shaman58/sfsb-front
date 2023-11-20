import {ref} from 'vue';

export default function useOperationFormatting() {
  const operations = ref([
    {title: 'Станочная', label: 'FULL'},
    {title: 'Ручная', label: 'PROCESS_TIME_ONLY'},
    {title: 'Вычисляемая', label: 'COMPUTED'},
  ]);

  const formatOperationData = (data) => {
    switch (data) {
      case 'FULL':
        return `Станочная`;
      case 'PROCESS_TIME_ONLY':
        return `Ручная`;
      case 'COMPUTED':
        return `Вычисляемая`;
      default:
        break;
    }

    return '';
  };

  return {operations, formatOperationData};
}
