import Keycloak from 'keycloak-js'

const initOptions = {
  url: import.meta.env.VITE_APP_KEYCLOAK_URL,
  realm: 'sfsb',
  clientId: 'sfsb'
}

const keycloak = new Keycloak(initOptions)

const KeycloakPlugin = {
  install: (app) => {
    app.config.globalProperties.$keycloak = keycloak
  }
}
export default KeycloakPlugin
