import TechnologyComponent from "@/components/technology-new/TechnologyComponent.vue";
import TechnologyCard from "@/components/technology-new/TechnologyCard.vue";
import {type RouteMeta, type RouteRecordRaw} from "vue-router";

const technology: RouteRecordRaw & RouteMeta = {
    path: "/technology",
    component: TechnologyComponent,
    meta: {
        onlyFor: ["TECHNOLOGIST", "ADMIN"],
        name: "Технология"
    },
    children: [
        {
            path: ":id",
            component: TechnologyCard,
            meta: {
                onlyFor: ["TECHNOLOGIST", "ADMIN"],
                name: "Технология"
            },
        }
    ]
}

export default technology
