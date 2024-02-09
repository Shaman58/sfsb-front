import {type SupplyStoreType} from "@/pinia-store/supply";
import {storeToRefs} from "pinia";


const supplyMap = (store: SupplyStoreType) => {
    const {materialsAll, materialsNoCost, materialsDateExpired} = storeToRefs(store())
    const {getMaterialsAll, getMaterialsNoCost, getMaterialsDateExpired} = store()
    return ({
        all: {
            path: "/supplier/all",
            title: "Все",
            data: materialsAll.value,
            fetch: getMaterialsAll
        },
        nocost: {
            path: "/supplier/nocost",
            title: "Без цены",
            data: materialsNoCost.value,
            fetch: getMaterialsNoCost
        },
        expired: {
            path: "/supplier/expired",
            title: "Просроченные",
            data: materialsDateExpired.value,
            fetch: getMaterialsDateExpired
        },
    })
}

export default supplyMap
