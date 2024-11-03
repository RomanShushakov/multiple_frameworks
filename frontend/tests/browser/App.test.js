// external imports
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import { createI18n } from 'vue-i18n';

// internal imports
import App from '../../src/App.vue';
import en from '../../src/translations/pin_check/en.json';
import de from '../../src/translations/pin_check/de.json';


test('App', async () => {
  const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'de',
    messages: {
      en,
      de,
    },
  });

  const screen = render(App, {
    global: {
      plugins: [i18n],
    },
  });

  await expect.element(screen.getByText('Company ID')).toBeInTheDocument();
  
  const langSelectOption = screen.getByTestId('select');
  await langSelectOption.selectOptions('de');
  await expect.element(screen.getByText('Firma ID')).toBeInTheDocument();
});
