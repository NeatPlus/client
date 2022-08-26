import {sleep} from '@ra/utils';

import store from 'store';
import * as authActions from 'store/actions/auth';
import Api, {request} from './api';

export const checkSession = async () => {
    let {
        auth: {isAuthenticated}
    } = store.getState();

    try {
        const {data} = await request('/api/v1/user/is_authenticated/', {method: 'GET', credentials: 'include'});
        if(!isAuthenticated && data?.isAuthenticated) {
            dispatch(authActions.login());
            const user = await Api.getUser();
            dispatch(authActions.setUser(user));
        }
    } catch(error) {
        console.log(error);
    }
};

const dispatch = store.dispatch;

export default async function initStore() {
    await checkSession();

    loadUserData();

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

export const loadUserData = async () => {
    // To wait for the user value to be reflected
    // TODO: bit dirty use some hook/event
    await sleep(500);
    let {
        auth: {user}
    } = store.getState();

    if(user?.id) {
        await Api.getOrganizations();
        await Api.getMyOrganizations();
    }
};

