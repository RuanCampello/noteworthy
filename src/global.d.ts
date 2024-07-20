import en from '../public/locales/en/translation.json';

type Messages = typeof en;
declare global {
  interface IntlMessages extends Messages {}
}
