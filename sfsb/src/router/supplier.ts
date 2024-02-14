import SupplyComponent from "@/components/supply-new/SupplyComponent.vue";
import SupplyCard from "@/components/supply-new/SupplyCard.vue";
import {type RouteMeta, type RouteRecordRaw} from "vue-router";

const supplier: RouteRecordRaw & RouteMeta =  {
    path: "/supplier",
    component: SupplyComponent,
    meta: {
        onlyFor: ["SUPPLIER", "ADMIN"],
    },
    children: [
        {
            path: "all",
            component: SupplyCard,
            props: {type: "all"},
            meta: {
                onlyFor: ["SUPPLIER", "ADMIN"],
            },
        },
        {
            path: "nocost",
            component: SupplyCard,
            props: {type: "nocost"},
            meta: {
                onlyFor: ["SUPPLIER", "ADMIN"],
            },
        },
        {
            path: "expired",
            component: SupplyCard,
            props: {type: "expired"},
            meta: {
                onlyFor: ["SUPPLIER", "ADMIN"],
            },
        },
    ]
}

export default supplier
