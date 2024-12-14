// Plugins/vuetify.js

import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import {createVuetify} from 'vuetify';
import {md3} from 'vuetify/blueprints';
import {ru, en} from 'vuetify/locale'; // Импорт локализации Vuetify
import {VTimePicker} from 'vuetify/labs/VTimePicker'

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
        messages: {
            ru: {
                ...ru,
                $vuetify: {
                    timePicker: {
                        title: 'Выберите время', // Заголовок компонента
                        cancel: 'Отмена',       // Кнопка отмены
                        save: 'Сохранить',      // Кнопка сохранения
                        am: 'AM',               // Утро (для 12-часового формата)
                        pm: 'PM',               // Вечер (для 12-часового формата)
                    },
                },
            },
            en, // Сохранить английскую локализацию
        },
    },
    components: {
        VTimePicker
    }
});
