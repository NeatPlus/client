import 'styles/_base.scss';

import store from 'store';

import Api from './api';
import initStore from './initStore';

setInterval(async () => {
    let {
        auth: {refreshToken}
    } = store.getState();
    refreshToken && await Api.refreshToken(refreshToken);
}, 240*1000);

initStore();
