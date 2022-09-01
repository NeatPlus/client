import store from 'store';

import Api from 'services/api';
import {_} from 'services/i18n';

import * as uiActions from 'store/actions/ui';
import * as authActions from 'store/actions/auth';
import * as draftActions from 'store/actions/draft';

const {dispatch} = store;

export const dispatchLogin = async (user) => {
    let userData = user;
    if (!userData) {
        try {
            userData = await Api.getUser();
        } catch(error) {
            console.log(error);
            throw new Error(_('Session authentication failed!'));
        }
    }
    dispatch(authActions.login());
    dispatch(authActions.setUser(userData));
};

// To be used when logging out due to error
export const dispatchLogout = async () => {
    const {auth: {isAuthenticated}} = store.getState();
    if(isAuthenticated) {
        dispatch(authActions.logout());
        dispatch(uiActions.showExpiryModal());
    }
};

export const initDraftAnswers = (projectId, moduleCode = 'sens', surveyId) => {
    dispatch(draftActions.setTitle(''));
    dispatch(draftActions.setDraftModule(moduleCode));
    dispatch(draftActions.setProjectId(projectId));
    dispatch(draftActions.setDraftAnswers([]));
    dispatch(draftActions.setSurveyId(surveyId ?? null));
};
