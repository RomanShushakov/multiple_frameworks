// external imports
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import en from './translations/pin_check/en.json';
import de from './translations/pin_check/de.json'; 

// internal imports
import './style.css';
import App from './App.vue';


const i18n = createI18n({
  locale: 'de',
  fallbackLocale: 'en',
  messages: {
    en,
    de,
  },
});

const app = createApp(App);

app.use(i18n);
app.mount('#app');
