import {sleep} from '@ra/utils';

import store from 'store';
import * as authActions from 'store/actions/auth';
import * as uiActions from 'store/actions/ui';
import Api from './api';


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
            dispatch(uiActions.showExpiryModal());
        }
        const user = await Api.getUser();
        loadUserData(user.id);
    }

    await Api.getLegislations();

    await Api.getContextsModules();

    await Promise.all([
        Api.getQuestionGroups(),
        Api.getQuestions(),
        Api.getStatements(),
        Api.getMitigations(),
        Api.getOpportunities(),
    ]);

    await Api.getStatementTags();
    await Api.getSurveyWeightages();
    await Api.getOrganizationMemberRequests();
}

export const loadUserData = async (userId) => {
    //To wait for the user value to be reflected
    //TODO: bit dirty use some hook/event
    await sleep(500);
    await Api.getOrganizations();
    await Api.getMyOrganizations();
};

