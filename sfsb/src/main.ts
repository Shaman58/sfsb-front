
// Components
import App from './App.vue'

// Composable
import {createApp} from 'vue'

// Plugins
import {registerPlugins} from '@/plugins'

const app = createApp(App)
registerPlugins(app)
app.mount('#app')
