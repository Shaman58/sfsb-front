import DataPage1 from "@/views/DataPage1.vue";
import DataPageMain from "@/components/data-page/DataPageMain.vue";
import {type RouteMeta, type RouteRecordRaw} from "vue-router";
import ClientCard from "@/components/commerce/Clients/ClientCard.vue";
import MaterialComponent from "@/components/data-page/MaterialComponent.vue";
import ToolComponent from "@/components/data-page/ToolComponent.vue";

const data: RouteRecordRaw & RouteMeta = {
    path: "/data",
    component: DataPage1,
    meta: {
        onlyFor: ["TECHNOLOGIST", "ADMIN"],
    },
    children: [
        {
            path: "materials",
            component: DataPageMain,
            meta: {
                onlyFor: ["TECHNOLOGIST", "ADMIN"],
                name: "Материалы",
            },
            children: [
                {
                    path: ":id",
                    component: MaterialComponent,
                    meta: {
                        onlyFor: ["TECHNOLOGIST", "ADMIN"],
                        name: "Материалы",
                    },
                },
            ]
        },
        {
            path: "cutters", component: DataPageMain, meta: {
                onlyFor: ["TECHNOLOGIST", "ADMIN"],
                name: "Инструменты",
            },
            children: [
                {
                    path: ":id",
                    component: ToolComponent,
                    meta: {
                        onlyFor: ["TECHNOLOGIST", "ADMIN"],
                        name: "Инструменты",
                    },
                },
            ]
        },
        {
            path: "specials", component: DataPageMain, meta: {
                onlyFor: ["TECHNOLOGIST", "ADMIN"],
                name: "Специнструменты"
            },
            children: [
                {
                    path: ":id",
                    component: ToolComponent,
                    meta: {
                        onlyFor: ["TECHNOLOGIST", "ADMIN"],
                        name: "Специнструменты"
                    },
                },
            ]
        },
        {
            path: "toolings", component: DataPageMain, meta: {
                onlyFor: ["TECHNOLOGIST", "ADMIN"],
                name: "Оснастка"
            },
            children: [
                {
                    path: ":id",
                    component: ToolComponent,
                    meta: {
                        onlyFor: ["TECHNOLOGIST", "ADMIN"],
                        name: "Оснастка"
                    },
                },
            ]
        },
    ]
}

export default data
