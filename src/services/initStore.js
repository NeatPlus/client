import Api from './api';
import store from 'store';

import * as authActions from 'store/actions/auth';

const dispatch = store.dispatch;

export default async function initStore() {
    let {
        auth: {isAuthenticated, refreshToken}
    } = store.getState();

    if(isAuthenticated) {
        if(refreshToken) {
            await Api.refreshToken(refreshToken);
        } else {
            dispatch(authActions.logout());
        }
        await Api.getUser();
    }

    await Promise.all([
        Api.getOrganizations(),
    ]);
}

