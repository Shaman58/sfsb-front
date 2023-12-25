import { createRouter, createWebHistory } from "vue-router";
import Commerce from "@/views/Commerce.vue";
import Technology from "@/views/Technology.vue";
import MainPage from "@/views/MainPage.vue";
import Staff from "@/views/Staff.vue";
import Supplier from "@/views/Supplier.vue";
import NotFound from "@/views/NotFound.vue";
import { useCurrentUserStore } from "@/pinia-store/currentUser";
import { useToast } from "vue-toast-notification";
import { storeToRefs } from "pinia";

const toast = useToast();

const routes = [
    {
        path: "/",
        component: MainPage,
    },
    {
        path: "/supplier",
        component: Supplier,
        meta: {
            onlyFor: "supplier",
        },
    },
    {
        path: "/staff",
        component: Staff,
    },
    {
        path: "/commerce",
        component: Commerce,
    },
    {
        path: "/technology",
        component: Technology,
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

router.beforeEach(async (to, from, next) => {
    const { fetchUser } = useCurrentUserStore();
    const { user } = storeToRefs(useCurrentUserStore());

    await fetchUser();

    if (to.path === "/supplier") {
        if (!user.value) {
            toast.error("Текущий пользователь не определен");
            return next(false);
        }
        if (
            user.value &&
            user.value.roles.some((e) => e.toLowerCase().includes("supplier"))
        )
            return next();
        if (
            user.value &&
            !user.value.roles.some((e) => e.toLowerCase().includes("supplier"))
        ) {
            toast.error("У вас нет прав доступа к этой странице");
            return next(false);
        }
    }
    next();
});

export default router;
