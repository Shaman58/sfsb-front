import Keycloak from 'keycloak-js';
import config from "@/plugins/keycloak/config";

class Service {
  constructor() {
    this.keycloak = new Keycloak(config);
  }

  async init() {
    await this.keycloak.init({
      onLoad: 'login-required',
    });
  }

  hasRoleTech() {
    return this.keycloak.hasRealmRole('technologist');
  }

  hasRoleManager() {
    return this.keycloak.hasRealmRole('manager');
  }

  logout() {
    this.keycloak.logout();
  }

  login(options) {
    this.keycloak.login(options);
  }

  isAuthenticated() {
    return this.keycloak.authenticated;
  }

  updateToken(number) {
    return this.keycloak.updateToken(number);
  }
}

const keycloakService = new Service();
export default keycloakService;
