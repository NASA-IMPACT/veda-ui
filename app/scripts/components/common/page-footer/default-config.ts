import { getFooterSettingsFromVedaConfig } from 'veda';
const defaultFooterSettings = {
  secondarySection: {
    division: 'NASA EarthData 2024',
    version: 'BETA VERSION',
    title: 'NASA Official',
    name: 'Manil Maskey',
    to: 'test@example.com',
    type: 'email'
  },
  returnToTop: false
};
const footerSettings =
  getFooterSettingsFromVedaConfig() ?? defaultFooterSettings;

export { footerSettings };
