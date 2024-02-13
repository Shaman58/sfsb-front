import {createRouter, createWebHistory} from "vue-router";
import NotFound from "@/views/NotFound.vue";
import StartPage from "@/views/StartPage.vue";
import {useCurrentUserStore} from "@/pinia-store/currentUser";
import {useToast} from "vue-toast-notification";
import {storeToRefs} from "pinia";
import CompanyPage from "@/views/CompanyPage.vue";
import Company1 from "@/components/company/Company1.vue";
import {useCurrentTool} from "@/pinia-store/tools";
import UsersComponent from "@/components/users/UsersComponent.vue";
import UserCard from "@/components/users/UserCard.vue";
import TechnologyComponent from "@/components/technology-new/TechnologyComponent.vue";
import TechnologyCard from "@/components/technology-new/TechnologyCard.vue";
import Support from "@/views/Support.vue";
import data from "@/router/data";
import supplier from "@/router/supplier";
import commerce from "@/router/commerce";

const toast = useToast();

const routes = [
    {
        path: "/",
        component: StartPage,
    },
    {
        path: "/support",
        component: Support
    },
    {
        path: "/company/:id",
        component: Company1,
        meta: {
            onlyFor: ["ADMIN"],
        },
    },
    {
        path: "/company",
        component: CompanyPage,
        meta: {
            onlyFor: ["ADMIN"],
        }
    },
    data,
    supplier,
    {
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
    },
    commerce,
    {
        path: "/technology",
        component: TechnologyComponent,
        meta: {
            onlyFor: ["TECHNOLOGIST", "ADMIN"],
        },
        children: [
            {
                path: ":id",
                component: TechnologyCard,
                meta: {
                    onlyFor: ["TECHNOLOGIST", "ADMIN"],
                },
            }
        ]
    },
    {
        path: "/not-found",
        component: NotFound
    },
    {
        path: "/:catchAll(.*)",
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach(async (to, _, next) => {
    const {fetchUser} = useCurrentUserStore();
    const {user} = storeToRefs(useCurrentUserStore());
    const {setCurrentRoute} = useCurrentTool()
    setCurrentRoute(to.path)

    !user.value && await fetchUser();

    if (!user.value) {
        toast.error("Текущий пользователь не определен");
        return next(false);
    }
    if (user.value && !to.meta.onlyFor) return next();
    if (
        user.value &&
        user.value.roles.some((role) =>
            (to.meta?.onlyFor as string[]).some((e: string) => e === role)
        )
    ) {
        return next();
    } else {
        toast.error("У вас нет прав доступа к этой странице");
        return next("/");
    }

});

export default router;
