import { defineStore } from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";
import keycloakService from "@/plugins/keycloak/service.mjs";

const toast = useToast();

export const useCurrentUserStore = defineStore("current-user", () => {
    const user = ref<Person | null>(null);

    const fetchUser = async () => {
        try {
            const response = await api.get<Person[]>("/user");
            const userKeycloak =
                await keycloakService.keycloak.loadUserProfile();
            const fetchedUser =
                userKeycloak &&
                response.data.find((e) => e.id === userKeycloak.id);
            user.value = fetchedUser || null;
        } catch (error) {
            toast.error("Ошибка при загрузке данных пользователя " + error);
        }
    };

    return {
        user,
        fetchUser,
    };
});
