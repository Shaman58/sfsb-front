import Commerce from "@/views/Commerce.vue";
import ClientsComponent from "@/components/commerce/Clients/ClientsComponent.vue";
import ClientCard from "@/components/commerce/Clients/ClientCard.vue";
import OrdersComponent from "@/components/commerce/Orders/OrdersComponent.vue";
import OrderCard from "@/components/commerce/Orders/OrderCard.vue";
import OperationsComponent from "@/components/commerce/Operations/OperationsComponent.vue";
import OperationCard from "@/components/commerce/Operations/OperationCard.vue";
import {type RouteMeta, type RouteRecordRaw} from "vue-router";
import KP from "@/components/commerce/KP/KP.vue";
import KPCard from "@/components/commerce/KP/KPCard.vue";
import KPPrint from "@/components/commerce/KP/KPPrint.vue";
import ToolPrint from "@/components/commerce/Orders/ToolPrint.vue";

const commerce: RouteRecordRaw & RouteMeta = {
    path: "/commerce",
    component: Commerce,
    meta: {
        onlyFor: ["COMMERCE", "ADMIN"],
        name: "Коммерция"
    },
    children: [

        {
            path: "clients",
            component: ClientsComponent,
            meta: {
                onlyFor: ["COMMERCE", "ADMIN"],
                name: "Контрагенты"
            },
            children: [
                {
                    path: ":id",
                    component: ClientCard,
                    meta: {
                        onlyFor: ["COMMERCE", "ADMIN"],
                        name: "Контрагенты"
                    },
                },
            ]
        },
        {
            path: "orders",
            component: OrdersComponent,
            meta: {
                onlyFor: ["COMMERCE", "ADMIN"],
                name: "Заявки"
            },
            children: [
                {
                    path: ":id",
                    component: OrderCard,
                    meta: {
                        onlyFor: ["COMMERCE", "ADMIN"],
                        name: "Заявки"
                    },
                }
            ]
        },
        {
            path: "operations",
            component: OperationsComponent,
            meta: {
                onlyFor: ["COMMERCE", "ADMIN"],
                name: "Операции"
            },
            children: [
                {
                    path: ":id",
                    component: OperationCard,
                    meta: {
                        onlyFor: ["COMMERCE", "ADMIN"],
                        name: "Операции"
                    },
                },
            ]
        },
        {
            path: "kp",
            component: KP,
            meta: {
                onlyFor: ["COMMERCE", "ADMIN"],
                name: "КП"
            },
            children: [
                {
                    path: ":id/:clone",
                    component: KPCard,
                    meta: {
                        onlyFor: ["COMMERCE", "ADMIN"],
                        name: "КП карт"
                    },
                },
                {
                    path: ":id",
                    component: KPCard,
                    meta: {
                        onlyFor: ["COMMERCE", "ADMIN"],
                        name: "КП карт"
                    },
                },
            ]
        },
        {
            path: "print/:id",
            component: KPPrint,
            meta: {
                onlyFor: ["COMMERCE", "ADMIN"],
                name: "КП принт"
            }
        },
        {
            path: "print-order/:id/:company",
            component: KPPrint,
            meta: {
                onlyFor: ["COMMERCE", "ADMIN"],
                name: "Заказ принт"
            }
        },
        {
            path: "print-tool/:id/:company",
            component: ToolPrint,
            meta: {
                onlyFor: ["COMMERCE", "ADMIN"],
                name: "Заявка на иструмент"
            }
        }
    ]
}

export default commerce
