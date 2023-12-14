/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'
import store from '../store'
import piniaStore from "./piniaStore"

export function registerPlugins(app) {
  app.use(vuetify).use(router).use(store).use(piniaStore)
}
