import {sleep} from '@ra/utils';

import store from 'store';
import * as authActions from 'store/actions/auth';
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
        }
        const user = await Api.getUser();
        loadUserData(user.id);
    }

    await Promise.all([
        Api.getOrganizations(),
        Api.getContextsModules(),
    ]);

    await Promise.all([
        Api.getQuestionGroups(),
        Api.getQuestions('sens'),
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
    await Api.getMyOrganizations();
};

