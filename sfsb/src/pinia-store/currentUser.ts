import { defineStore } from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";
import { useKeycloak } from '@josempgon/vue-keycloak'
const toast = useToast();

const keycloakLoaded = ()=>new Promise(resolve => {
    const {isPending} = useKeycloak()
    const interval = setInterval(()=>{
        if(!isPending.value) {
            clearInterval(interval)
            resolve(true)
        }
    },1000)
})

export const useCurrentUserStore = defineStore("current-user", () => {
    const user = ref<Person | null>(null);

    const fetchUser = async () => {
        const {keycloak, } = useKeycloak()
        try {
            await keycloakLoaded()
            const { data } = await api.get<Person[]>("/user");
            const userKeycloak =
                await keycloak.loadUserProfile() as Person;
            const fetchedUser =
                userKeycloak && data.find((e) => e.id === userKeycloak.id);
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
