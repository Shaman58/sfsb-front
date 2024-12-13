// Plugins/vuetify.js

import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { md3 } from 'vuetify/blueprints';
import { ru, en } from 'vuetify/locale'; // Импорт локализации Vuetify

export default createVuetify({
    defaults: {
        VBtn: {
            color: 'primary',
            variant: 'outlined',
            rounded: true,
        },
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#000000',
                    secondary: '#6b6b6b',
                },
            },
        },
    },
    blueprint: md3,
    locale: {
        locale: 'ru', // Установить текущую локаль
        fallback: 'en', // Установить резервную локаль
        messages: { ru, en }, // Подключить сообщения
    },
});
