import {sleep} from '@ra/utils';

import store from 'store';
import * as authActions from 'store/actions/auth';
import * as uiActions from 'store/actions/ui';
import Api from './api';


const dispatch = store.dispatch;

async function initUser() {
    let {
        auth: {isAuthenticated, refreshToken}
    } = store.getState();

    if(isAuthenticated) {
        if(refreshToken) {
            await Api.refreshToken(refreshToken);
        } else {
            dispatch(authActions.logout());
            dispatch(uiActions.showExpiryModal());
        }
        const user = await Api.getUser();
        dispatch(authActions.setUser(user));
        loadUserData(user.id);
    }

}

export default async function initStore() {
    await initUser();
    Api.getLegislations();

    await Api.getContextsModules();

    Api.getQuestionGroups();
    Api.getQuestions('sens');
    Api.getStatements();
    Api.getMitigations();
    Api.getOpportunities();

    Api.getStatementTags();
    Api.getSurveyWeightages();
    Api.getOrganizationMemberRequests();
}

export const loadUserData = async (userId) => {
    //To wait for the user value to be reflected
    //TODO: bit dirty use some hook/event
    await sleep(500);
    await Api.getOrganizations();
    await Api.getMyOrganizations();
};

