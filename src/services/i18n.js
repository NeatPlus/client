import store from 'store';
import {defaultTranslator as translator} from '@ra/components/I18n/i18nContext';

import frTranslations from './locale/locale_fr.json';
import esTranslations from './locale/locale_es.json';

export const translations = {
    en: {},
    fr: parseTranslations(frTranslations),
    es: parseTranslations(esTranslations),
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

function parseTranslations(translationsObject) {
    return Object.entries(translationsObject).reduce((acc, [key, value]) => {
        if(key) {
            if(Array.isArray(value)) {
                acc[key] = value[1];
                if(value[0]) {
                    acc[value[0]] = value[2];
                }
            } else {
                acc[key] = String(value);
            }
        }
        return acc;
    }, {});
}
