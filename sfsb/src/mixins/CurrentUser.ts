// import keycloakService from "@/plugins/keycloak/service.mjs";
import { Ref, ref } from "vue";
import { useKeycloak } from '@josempgon/vue-keycloak'

const useCurrentUser = (): {
    user: Ref<Person | null>;
    error: Ref<unknown | null>;
} => {
    const {keycloak } = useKeycloak()
    const user: Ref<Person | null> = ref(null);
    const error: Ref<unknown | null> = ref(null);

    const exec = async () => {
        try {
            const user: Person =
                await keycloak.loadUserProfile() as Person;
            return { userResponse: user, errorResponse: null };
        } catch (error) {
            return { userResponse: null, errorResponse: error };
        }
    };
    exec().then(({ userResponse, errorResponse }) => {
        user.value = userResponse;
        error.value = errorResponse;
    });

    return { user, error };
};
export default useCurrentUser;
