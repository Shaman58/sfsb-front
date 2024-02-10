import { type SupplyStoreType } from "@/pinia-store/supply";
import { storeToRefs } from "pinia";

interface SupplyMapItem {
    path: string;
    title: string;
    data: Material[];
    fetch: Function;
}

export interface SupplyMapInterface {
    all: SupplyMapItem;
    nocost: SupplyMapItem;
    expired: SupplyMapItem;
}

const supplyMap = (store: SupplyStoreType): SupplyMapInterface => {
    const { materialsAll, materialsNoCost, materialsDateExpired } = storeToRefs(
        store()
    );
    const { getMaterialsAll, getMaterialsNoCost, getMaterialsDateExpired } =
        store();
    return {
        all: {
            path: "/supplier/all",
            title: "Все",
            data: materialsAll.value,
            fetch: getMaterialsAll,
        },
        nocost: {
            path: "/supplier/nocost",
            title: "Без цены",
            data: materialsNoCost.value,
            fetch: getMaterialsNoCost,
        },
        expired: {
            path: "/supplier/expired",
            title: "Просроченные",
            data: materialsDateExpired.value,
            fetch: getMaterialsDateExpired,
        },
    };
};

export default supplyMap;
export type SupplyMapType = ReturnType<supplyMap>;
