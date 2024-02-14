import Commerce from "@/views/Commerce.vue";
import ClientsComponent from "@/components/commerce/Clients/ClientsComponent.vue";
import ClientCard from "@/components/commerce/Clients/ClientCard.vue";
import OrdersComponent from "@/components/commerce/Orders/OrdersComponent.vue";
import OrderCard from "@/components/commerce/Orders/OrderCard.vue";
import OperationsComponent from "@/components/commerce/Operations/OperationsComponent.vue";
import OperationCard from "@/components/commerce/Operations/OperationCard.vue";
import {type RouteMeta, type RouteRecordRaw} from "vue-router";

const commerce: RouteRecordRaw & RouteMeta = {
    path: "/commerce",
    component: Commerce,
    meta: {
        onlyFor: ["COMMERCE", "ADMIN"],
    },
    children: [

        {
            path: "clients",
            component: ClientsComponent,
            meta: {
                onlyFor: ["COMMERCE", "ADMIN"],
            },
            children: [
                {
                    path: ":id",
                    component: ClientCard,
                    meta: {
                        onlyFor: ["COMMERCE", "ADMIN"],
                    },
                },
            ]
        },
        {
            path: "orders",
            component: OrdersComponent,
            meta: {
                onlyFor: ["COMMERCE", "ADMIN"],
            },
            children: [
                {
                    path: ":id",
                    component: OrderCard,
                    meta: {
                        onlyFor: ["COMMERCE", "ADMIN"],
                    },
                }
            ]
        },
        {
            path: "operations",
            component: OperationsComponent,
            meta: {
                onlyFor: ["COMMERCE", "ADMIN"],
            },
            children: [
                {
                    path: ":id",
                    component: OperationCard,
                    meta: {
                        onlyFor: ["COMMERCE", "ADMIN"],
                    },
                },
            ]
        },
    ]
}

export default commerce
