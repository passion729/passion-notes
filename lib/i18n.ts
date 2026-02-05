import { defineI18n } from 'fumadocs-core/i18n';

const i18nConfig = defineI18n({
  defaultLanguage: 'cn',
  languages: ['en', 'cn'],
  hideLocale: 'default-locale',
});

export const i18n = {
  ...i18nConfig,
  locale: i18nConfig.defaultLanguage,
};
