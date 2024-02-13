import {createRouter, createWebHistory} from "vue-router";
import Commerce from "@/views/Commerce.vue";
import NotFound from "@/views/NotFound.vue";
import StartPage from "@/views/StartPage.vue";
import {useCurrentUserStore} from "@/pinia-store/currentUser";
import {useToast} from "vue-toast-notification";
import {storeToRefs} from "pinia";
import CompanyPage from "@/views/CompanyPage.vue";
import Company1 from "@/components/company/Company1.vue";
import DataPage1 from "@/views/DataPage1.vue";
import DataPageMain from "@/components/data-page/DataPageMain.vue";
import {useCurrentTool} from "@/pinia-store/tools";
import ClientsComponent from "@/components/commerce/Clients/ClientsComponent.vue";
import OrdersComponent from "@/components/commerce/Orders/OrdersComponent.vue";
import ClientCard from "@/components/commerce/Clients/ClientCard.vue";
import OperationsComponent from "@/components/commerce/Operations/OperationsComponent.vue";
import OperationCard from "@/components/commerce/Operations/OperationCard.vue";
import UsersComponent from "@/components/users/UsersComponent.vue";
import UserCard from "@/components/users/UserCard.vue";
import OrderCard from "@/components/commerce/Orders/OrderCard.vue";
import TechnologyComponent from "@/components/technology-new/TechnologyComponent.vue";
import TechnologyCard from "@/components/technology-new/TechnologyCard.vue";
import SupplyComponent from "@/components/supply-new/SupplyComponent.vue";
import SupplyCard from "@/components/supply-new/SupplyCard.vue";
import Support from "@/views/Support.vue";

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
    {
        path: "/data",
        component: DataPage1,
        meta: {
            onlyFor: ["TECHNOLOGIST", "ADMIN"],
        },
        children: [
            {
                path: "materials", component: DataPageMain, meta: {
                    onlyFor: ["TECHNOLOGIST", "ADMIN"],
                },
            },
            {
                path: "cutters", component: DataPageMain, meta: {
                    onlyFor: ["TECHNOLOGIST", "ADMIN"],
                },
            },
            {
                path: "specials", component: DataPageMain, meta: {
                    onlyFor: ["TECHNOLOGIST", "ADMIN"],
                },
            },
            {
                path: "toolings", component: DataPageMain, meta: {
                    onlyFor: ["TECHNOLOGIST", "ADMIN"],
                },
            },
        ]
    },
    {
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
    },
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
    {
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
    },
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
