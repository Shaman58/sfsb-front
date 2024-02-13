import TechnologyComponent from "@/components/technology-new/TechnologyComponent.vue";
import TechnologyCard from "@/components/technology-new/TechnologyCard.vue";

const technology = {
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
}

export default technology
