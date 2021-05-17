import store from 'store';

import Api from 'services/api';
import * as authActions from 'store/actions/auth';

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
