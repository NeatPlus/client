import RequestBuilder from '@ra/services/request';
import store from 'store';

import * as authActions from 'store/actions/auth';
import * as contextActions from 'store/actions/context';
import * as organizationActions from 'store/actions/organization';
import * as surveyActions from 'store/actions/survey';
import * as questionActions from 'store/actions/question';
import * as statementActions from 'store/actions/statement';
import * as weightageActions from 'store/actions/weightage';
import * as notificationActions from 'store/actions/notification';
import * as legislationActions from 'store/actions/legislation';

const dispatch = store.dispatch;

const TokenInterceptor = req => {
    let {
        auth: {token},
    } = store.getState();
    if(token) {
        req.headers.append('Authorization', `Bearer ${token}`);
    }
};

const RefreshTokenInterceptor = async res => {
    let {
        auth: {isAuthenticated, refreshToken}
    } = store.getState();
    if(isAuthenticated && refreshToken && res.status === 403) {
        await ApiService.refreshToken(refreshToken);
    }
};

let apiVersion = process.env.REACT_APP_API_VERSION || 'v1';

export const request = new RequestBuilder(process.env.REACT_APP_API_BASE_URL)
    .setRequestInterceptors([TokenInterceptor, console.log])
    .setResponseInterceptors([RefreshTokenInterceptor, console.log])
    .setRetryConfig({backoffFactor: 0, maxRetries: 2})
    .build();

class Api {
    async get(url, options) {
        const {error, data, response} = await request(`/api/${apiVersion}${url}`, options);
        if(error) {
            if(response.status === 500) {
                throw new Error('500 Internal Server Error');
            }
            console.log(data);
            throw data || 'Request Error';
        }
        return data;
    }

    async post(url, body, options) {
        const headers = options?.headers || {
            'content-type': 'application/json'
        };
        const {error, data, response} = await request(`/api/${apiVersion}${url}`,
            {
                method: 'POST',
                headers,
                body: options?.headers ? body : JSON.stringify(body),
            });
        if(error) {
            if(response.status === 500) {
                throw new Error('500 Internal Server Error');
            }
            console.log(data);
            throw data || 'Request Error';
        }
        return data;
    }

    async patch(url, body, options) {
        const headers = options?.headers || {
            'content-type': 'application/json'
        };
        const {error, data, response} = await request(`/api/${apiVersion}${url}`, {
            method: 'PATCH',
            headers,
            body: options?.headers ? body : JSON.stringify(body),
        });
        if(error) {
            if(response.status === 500) {
                throw new Error('500 Internal Server Error');
            }
            console.log(data);
            throw data || 'Request Error';
        }
        return data;
    }

    async put(url, body) {
        const {error, data, response} = await request(`/api/${apiVersion}${url}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if(error) {
            if(response.status === 500) {
                throw new Error('500 Internal Server Error');
            }
            console.log(data);
            throw data || 'Request Error';
        }
        return data;
    }

    async delete(url) {
        const {error, data, response} = await request(`/api/${apiVersion}${url}`, {
            method: 'DELETE',
        });
        if(error) {
            if(response.status === 500) {
                throw new Error('500 Internal Server Error');
            }
            console.log(data);
            throw data || 'Request Error';
        }
        return data;
    }

    async refreshToken(refresh) {
        try {
            const data = await this.post('/jwt/refresh/', {
                refresh
            });
            if(data?.access) {
                return dispatch(authActions.setToken(data.access));
            }
            dispatch(authActions.logout());
        }
        catch(error) {
            dispatch(authActions.logout());
            console.log(error);
        }
    }

    async getUser() {
        return await this.get('/user/me/');
    }

    patchUser = body => {
        return this.patch('/user/me/', body);
    }

    resendConfirmEmail = body => {
        return this.post('/user/email_confirm/', body);
    }

    verifyEmail = body => {
        return this.post('/user/email_confirm/verify/', body);
    }

    requestEmailChange = body => {
        return this.post('/user/email_change/', body);
    }

    verifyEmailChange = body => {
        return this.post('/user/email_change/verify/', body);
    }

    async getOrganizations() {
        dispatch(organizationActions.setStatus('loading'));
        try {
            const data = await this.get('/organization/');
            dispatch(organizationActions.setOrganizations(data?.results || []));
            dispatch(organizationActions.setStatus('complete'));
        } catch(error) {
            dispatch(organizationActions.setStatus('failed'));
            console.log(error);
        }
    }

    async getContextsModules() {
        try {
            const [contexts, modules] = await Promise.all([
                this.get('/context/'),
                this.get('/module/'),
            ]);
            dispatch(contextActions.setContexts(contexts?.results || []));
            dispatch(contextActions.setModules(modules?.results || []));
        } catch(error) {
            console.log(error);
        }
    }

    async getSurveys() {
        dispatch(surveyActions.setStatus('loading'));
        try {
            const data = await this.get('/survey/');
            dispatch(surveyActions.setSurveys(data?.results || []));
            dispatch(surveyActions.setStatus('complete'));
        } catch(error) {
            dispatch(surveyActions.setStatus('failed'));
            console.log(error);
        }
    }

    async getSurveyDetails(projectId) {
        try {
            const query = {
                limit: -1,
                survey__project: projectId,
            };
            const [surveyAnswers, surveyResults] = await Promise.all([
                this.get('/survey-answer/', {query}), 
                this.get('/survey-result/', {query}),
            ]);
            dispatch(surveyActions.setSurveyAnswers(surveyAnswers?.results || []));
            dispatch(surveyActions.setSurveyResults(surveyResults?.results || []));
        } catch(error) {
            console.log(error);
        }
    }

    async getQuestionGroups() {
        try {
            const data = await this.get('/question-group/?limit=-1');
            dispatch(questionActions.setQuestionGroups(data?.results || []));
        } catch(error) {
            console.log(error);
        }
    }

    async getQuestions(code) {
        dispatch(questionActions.setStatus('loading'));
        try {
            const {
                context: {modules},
                question: {options},
            } = store.getState();
            const query = {
                limit: -1, 
                module: modules.find(mod => mod.code === code)?.id,
            };
            const data = await this.get('/question/', {query});
            dispatch(questionActions.setQuestions(code, data?.results || []));
            if(!options.length) {
                const optionsData = await this.get('/option/', {query: {limit: -1}});
                dispatch(questionActions.setOptions(optionsData?.results || []));
            }
            dispatch(questionActions.setStatus('complete'));
        } catch(error) {
            dispatch(questionActions.setStatus('failed'));
            console.log(error);
        }
    }

    async getStatements() {
        dispatch(statementActions.setStatus('loading'));
        try {
            const data = await this.get('/statement/?limit=-1');
            dispatch(statementActions.setStatements(data?.results || []));
            const topics = await this.get('/statement-topic/?limit=-1');
            dispatch(statementActions.setTopics(topics?.results || []));
            dispatch(statementActions.setStatus('complete'));
        } catch(error) {
            dispatch(statementActions.setStatus('failed'));
            console.log(error);
        }
    }

    async getStatementTags() {
        try {
            const data = await this.get('/statement-tag-group/?limit=-1');
            dispatch(statementActions.setStatementTagGroups(data?.results || []));
            const tags = await this.get('/statement-tag/?limit=-1');
            dispatch(statementActions.setStatementTags(tags?.results || []));
        } catch(error) {
            console.log(error);
        }
    }

    async getMitigations() {
        try {
            const data = await this.get('/mitigation/?limit=-1');
            dispatch(statementActions.setMitigations(data?.results || []));
        } catch(error) {
            console.log(error);
        }
    }

    async getOpportunities() {
        try {
            const data = await this.get('/opportunity/?limit=-1');
            dispatch(statementActions.setOpportunities(data?.results || []));
        } catch(error) {
            console.log(error);
        }
    }

    async getSurveyWeightages() {
        dispatch(weightageActions.setStatus('loading'));
        try {
            const [questionStatements, optionStatements] = await Promise.all([
                this.get('/question-statement/?limit=-1'), 
                this.get('/option-statement/?limit=-1')
            ]);
            dispatch(weightageActions.setQuestionStatements(questionStatements?.results || []));
            dispatch(weightageActions.setOptionStatements(optionStatements?.results || []));
            dispatch(weightageActions.setStatus('complete'));
        } catch(error) {
            dispatch(weightageActions.setStatus('failed'));
            console.log(error);
        }
    }

    async getOrganizationMemberRequests() {
        let {
            auth: {isAuthenticated},
        } = store.getState();
        if(!isAuthenticated) {
            return;
        }
        try {
            const data = await this.get('/organization-member-request/');
            dispatch(organizationActions.setMemberRequests(data?.results || []));
        } catch (error) {
            console.log(error);
        }
    }

    getProjects = async query => {
        return this.get('/project/', {query});
    }

    getUsers = async () => {
        return this.get('/user/');
    }

    getNotifications = async () => {
        try {
            const data = await this.get('/notification?limit=10');
            dispatch(notificationActions.setNotifications(data?.results || []));
        } catch(error) {
            console.log(error);
        }
    };

    getProjectInvitations = async () => {
        try {
            const {
                auth: {adminOrganizations=[]},
            } = store.getState();

            const orgs = adminOrganizations?.map(a => a.id).join(',');
            if(!orgs) {
                return [];
            }
            const data = await this.get(`/project/?admin=${orgs}&status=pending`);
            dispatch(notificationActions.setInvitations(data.results || []));
        } catch (error) {
            console.log(error);
        }
    }

    getMyOrganizations = async () => {
        const {
            auth: {user={}}
        } = store.getState();

        const data = await this.get(`/organization/?admins=${user.id}`);
        dispatch(authActions.setAdminOrganizations(data?.results || []));
    }

    removeUsers = (projectId, body) => {
        return this.post(`/project/${projectId}/remove_users/`, body);
    }

    upsertUsers = (projectId, body) => {
        return this.post(`/project/${projectId}/update_or_add_users/`, body);
    }

    approveProject = (projectId) => {
        return this.post(`/project/${projectId}/accept/`);
    }

    rejectProject = (projectId) => {
        return this.post(`/project/${projectId}/reject/`);
    }

    markAllAsRead = () => {
        return this.post('/notification/mark_all_as_read/');
    }

    getProject = projectId => {
        return this.get(`/project/${projectId}/`);
    }

    getProjectAccessLevel = (projectId) => {
        return this.get(`/project/${projectId}/access_level/`);
    }

    createOrganization = body => {
        return this.post('/organization/', body);
    }

    editOrganization = (body, organizationId) => {
        return this.patch(`/organization/${organizationId}/`, body);
    }

    requestOrganizationMember = organizationId => {
        return this.post(`/organization/${organizationId}/member_request/`);
    }

    approveOrganizationMember = memberRequestId => {
        return this.post(`/organization-member-request/${memberRequestId}/accept/`);
    }

    rejectOrganizationMember = memberRequestId => {
        return this.post(`/organization-member-request/${memberRequestId}/reject`);
    }

    revokeMemberRequest = memberRequestId => {
        return this.delete(`/organization-member-request/${memberRequestId}/`);
    }

    patchSurvey = (surveyId, body) => {
        return this.patch(`/survey/${surveyId}/`, body);
    }

    getNotice = () => {
        return this.get('/notice/?ordering=-created_at');
    }

    async getLegislations() {
        try {
            const data = await this.get('/legal-document');
            dispatch(legislationActions.setLegislations(data?.results || []));
        } catch(error) {
            console.log(error);
        }
    }

    shareSurveyLink = surveyId => {
        return this.post(`/survey/${surveyId}/share_link/`);
    }

    unshareSurveyLink = surveyId => {
        return this.post(`/survey/${surveyId}/unshare_link/`);
    }

    updateSurveyLink = surveyId => {
        return this.post(`/survey/${surveyId}/update_link/`);
    }

    getPublicSurvey = identifier => {
        return this.get(`/survey/identifier/${identifier}/`);
    }
}

const ApiService = new Api();

export default ApiService;
