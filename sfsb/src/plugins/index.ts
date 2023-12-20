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
import { App } from 'vue'

export function registerPlugins(app: App<Element>) {
  app.use(vuetify).use(router).use(store).use(piniaStore)
}
