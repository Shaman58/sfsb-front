/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from "vuetify"

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  defaults: {
    VBtn: {
      color: 'primary',
      variant: 'outlined',
      rounded: true,
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#000000',
          secondary: '#6b6b6b',
        },
      },
    },
  },
})
