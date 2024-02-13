import UsersComponent from "@/components/users/UsersComponent.vue";
import UserCard from "@/components/users/UserCard.vue";

const staff = {
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
