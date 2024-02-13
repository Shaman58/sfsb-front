import DataPage1 from "@/views/DataPage1.vue";
import DataPageMain from "@/components/data-page/DataPageMain.vue";

const data = {
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
}

export default data
