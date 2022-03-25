import ReactGA from 'react-ga';

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
    ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID, {testMode: process.env.NODE_ENV === 'test'});

    await tokenRefresh();
    setInterval(tokenRefresh, 240*1000);

    initStore();
};
