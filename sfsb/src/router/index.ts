import { createRouter, createWebHistory } from "vue-router";
import Commerce from "@/views/Commerce.vue";
import Technology from "@/views/Technology.vue";
import MainPage from "@/views/MainPage.vue";
import Staff from "@/views/Staff.vue";
import Supplier from "@/views/Supplier.vue";
import { useCurrentUserStore } from "@/pinia-store/currentUser";
import { useToast } from "vue-toast-notification";

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
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.path === "/supplier") {
        const { user } = useCurrentUserStore();
        if (
            user &&
            user.roles.map((e) => e.toLowerCase()).includes("supplier")
        ) {
            return next();
        } else {
            toast.error("У вас нет прав доступа к этой странице");
            return false;
        }
    }
    next();
});

export default router;
