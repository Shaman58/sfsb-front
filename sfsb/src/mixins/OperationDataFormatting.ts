import {ref} from 'vue';

export default function useOperationFormatting() {
  const OPERATIONS = [
    {title: 'Станочная', label: 'FULL'},
    {title: 'Ручная', label: 'PROCESS_TIME_ONLY'},
    {title: 'Вычисляемая', label: 'COMPUTED'},
  ];

  const formatOperationData = (data) => {
    // switch (data) {
    //   case 'FULL':
    //     return `Станочная`;
    //   case 'PROCESS_TIME_ONLY':
    //     return `Ручная`;
    //   case 'COMPUTED':
    //     return `Вычисляемая`;
    //   default:
    //     break;
    // }

    // return '';
    const res = OPERATIONS.find((e) => e.label === data);
    return res ? res.title : ""

  };

  return {OPERATIONS, formatOperationData};
}
