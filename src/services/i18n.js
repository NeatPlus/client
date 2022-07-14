import store from 'store';
import {defaultTranslator as translator} from '@ra/components/I18n/i18nContext';

import frTranslations from './locale/locale_fr.json';
import esTranslations from './locale/locale_es.json';

export const translations = {
    en: {},
    fr: frTranslations,
    es: esTranslations,
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
