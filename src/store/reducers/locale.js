import * as actions from '../actions/locale';

const initialState = {
    currentLanguage: 'en',
    languages: [],
    translations: {},
};

const legislationReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.SET_CURRENT_LANGUAGE:
        return {...state, currentLanguage: action.lang};
    case actions.SET_LANGUAGES:
        return {...state, languages: action.languages};
    case actions.SET_TRANSLATIONS:
        return {...state, translations: action.translations};
    default:
        return state;
    }
};

export default legislationReducer;
