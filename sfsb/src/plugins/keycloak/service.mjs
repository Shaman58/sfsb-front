import Keycloak from 'keycloak-js';
import config from "@/plugins/keycloak/config";

class Service {
  isTockenExpired = false
  constructor() {
    this.keycloak = new Keycloak(config);
    this.isTockenExpired = this.keycloak.isTokenExpired
  }

  async init() {
    await this.keycloak.init({
      onLoad: 'login-required',
    });
  }

  getTocken(){
    return this.keycloak.token
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
