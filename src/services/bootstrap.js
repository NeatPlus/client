import 'styles/_base.scss';

import store from 'store';

import Api from './api';
import initStore from './initStore';

const tokenRefresh = async () => {
    let {
        auth: {refreshToken}
    } = store.getState();
    refreshToken && await Api.refreshToken(refreshToken);
};

export const bootstrapApp = async () => {
    await tokenRefresh();
    setInterval(tokenRefresh, 240*1000);

    initStore();
};
