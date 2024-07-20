import en from '../public/locales/english/translation.json';

type Messages = typeof en;
declare global {
  interface IntlMessages extends Messages {}
}
