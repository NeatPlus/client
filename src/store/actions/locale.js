export const SET_CURRENT_LANGUAGE = 'SET_CURRENT_LANGUAGE';
export const SET_TRANSLATIONS = 'SET_TRANSLATIONS';
export const SET_LANGUAGES = 'SET_LANGUAGES';

export function setCurrentLanguage(lang) {
    return {type: SET_CURRENT_LANGUAGE, lang};
}

export function setTranslations(translations) {
    return {type: SET_TRANSLATIONS, translations};
}

export function setLanguages(languages) {
    return {type: SET_LANGUAGES, languages};
}
