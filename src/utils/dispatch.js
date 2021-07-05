import store from 'store';

import Api from 'services/api';
import * as authActions from 'store/actions/auth';
import * as draftActions from 'store/actions/draft';

const {dispatch} = store;

export const dispatchLogin = async (accessToken, refreshToken, user) => {
    let userData = user;
    dispatch(authActions.setToken(accessToken));
    dispatch(authActions.setRefreshToken(refreshToken));
    if (!userData) {
        userData = await Api.getUser();
    }
    dispatch(authActions.login());
    dispatch(authActions.setUser(userData));
};

export const initDraftAnswers = (projectId) => {
    dispatch(draftActions.setTitle(''));
    dispatch(draftActions.setProjectId(projectId));
    dispatch(draftActions.setDraftAnswers([]));
};
