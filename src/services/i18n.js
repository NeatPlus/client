import store from 'store';
import {defaultTranslator as translator} from '@ra/components/I18n/i18nContext';

export const translations = {
    en: {},
    fr: {},
    es: {},
};

export const languages = [
    {code: 'en', title: 'English'},
    {code: 'fr', title: 'French'},
    {code: 'es', title: 'Spanish'},
];

export const _ = text => {
    const {locale: {currentLanguage, translations}} = store.getState();

    return translator(text, currentLanguage, translations);
};
