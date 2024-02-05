import {createRouter, createWebHistory} from "vue-router";
import Commerce from "@/views/Commerce.vue";
import Technology from "@/views/Technology.vue";
import Staff from "@/views/Staff.vue";
import Supplier from "@/views/Supplier.vue";
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

const toast = useToast();

const routes = [
    {
        path: "/",
        component: StartPage,
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
        component: Supplier,
        meta: {
            onlyFor: ["SUPPLIER", "ADMIN"],
        },
    },
    {
        path: "/staff",
        component: Staff,
        meta: {
            onlyFor: ["HR", "ADMIN"],
        },
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
                path: "orders", component: OrdersComponent, meta: {
                    onlyFor: ["COMMERCE", "ADMIN"],
                },
            },
            {
                path: "operations", component: OperationsComponent, meta: {
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
        component: Technology,
        meta: {
            onlyFor: ["TECHNOLOGIST", "ADMIN"],
        },
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
