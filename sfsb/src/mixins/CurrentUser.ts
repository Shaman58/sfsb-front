import keycloakService from "@/plugins/keycloak/service.mjs";
import { Ref, ref } from "vue";

 const useCurrentUser = (): {
     user: Ref<Person | null>;
     error: Ref<unknown | null>;
 } => {
     const user: Ref<Person | null> = ref(null);
     const error: Ref<unknown | null> = ref(null);

     const exec = async () => {
         try {
             const user: Person =
                 await keycloakService.keycloak.loadUserProfile();
             return { userResponce: user, errorResponce: null };
         } catch (error) {
             return { userResponce: null, errorResponce: error };
         }
     };
     exec().then(({ userResponce, errorResponce }) => {
         user.value = userResponce;
         error.value = errorResponce;
     });

     return { user, error };
 };
export default useCurrentUser;
