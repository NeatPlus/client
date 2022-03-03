import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {useI18nContext} from '@ra/components/I18n';

import {translations} from 'services/i18n';
import * as localeActions from 'store/actions/locale';

const SyncLocaleStore = ({children}) => {
    const {languages, selectedLanguage} = useI18nContext();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(localeActions.setTranslations(translations));
    }, [dispatch]);

    useEffect(() => {
        dispatch(localeActions.setLanguages(languages));
        dispatch(localeActions.setCurrentLanguage(selectedLanguage));
    }, [dispatch, selectedLanguage, languages]);

    return children;
};

export default SyncLocaleStore;
