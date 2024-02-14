import UsersComponent from "@/components/users/UsersComponent.vue";
import UserCard from "@/components/users/UserCard.vue";
import {type RouteMeta, type RouteRecordRaw} from "vue-router";

const staff: RouteRecordRaw & RouteMeta = {
    path: "/staff",
    component: UsersComponent,
    meta: {
        onlyFor: ["HR", "ADMIN"],
    },
    children: [
        {
            path: ":id",
            component: UserCard,
            meta: {
                onlyFor: ["HR", "ADMIN"],
            },
        },
    ]
}

export  default  staff
