import { createRouter, createWebHistory } from "vue-router";
import Commerce from "@/views/Commerce.vue";
import Technology from "@/views/Technology.vue";
import MainPage from "@/views/MainPage.vue";
import Staff from "@/views/Staff.vue";
import Supplier from "@/views/Supplier.vue";

const routes = [
    {
        path: "/",
        component: MainPage,
    },
    {
        path: "/supplier",
        component: Supplier,
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

export default router;
