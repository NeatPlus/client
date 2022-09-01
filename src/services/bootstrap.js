import ReactGA from 'react-ga';

import 'styles/_base.scss';

import initStore, {checkSession} from './initStore';

export const bootstrapApp = async () => {
    ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID, {testMode: process.env.NODE_ENV === 'test'});

    setInterval(checkSession, 240 * 1000);
    initStore();
};
