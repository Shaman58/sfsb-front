import CONSTS from "@/consts";

export default function useOperationFormatting() {


  const formatOperationData = (data) => {

    const res = CONSTS.OPERATIONS.find((e) => e.label === data);
    return res ? res.title : ""

  };

  return {OPERATIONS, formatOperationData};
}
