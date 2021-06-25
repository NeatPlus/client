import RequestBuilder from '@ra/services/request';
import store from 'store';

import * as authActions from 'store/actions/auth';
import * as userActions from 'store/actions/user';
import * as organizationActions from 'store/actions/organization';
import * as projectActions from 'store/actions/project';
import * as surveyActions from 'store/actions/survey';
import * as questionActions from 'store/actions/question';
import * as statementActions from 'store/actions/statement';
import * as weightageActions from 'store/actions/weightage';

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

    async getUsers() {
        try {
            const data = await this.get('/user/');
            dispatch(userActions.setUsers(data?.results || []));
        } catch(error) {
            console.log(error);
        }
    }

    async getOrganizations() {
        try {
            const data = await this.get('/organization/');
            dispatch(organizationActions.setOrganizations(data?.results || []));
        } catch(error) {
            console.log(error);
        }
    }

    async getProjects() {
        dispatch(projectActions.setStatus('loading'));
        try {
            const data = await this.get('/project/');
            dispatch(projectActions.setProjects(data?.results || []));
            dispatch(projectActions.setStatus('complete'));
        } catch(error) {
            dispatch(projectActions.setStatus('failed'));
            console.log(error);
        }
    }

    async getSurveys() {
        dispatch(surveyActions.setStatus('loading'));
        try {
            const data = await this.get('/survey/');
            dispatch(surveyActions.setSurveys(data?.results || []));
            const [surveyAnswers, surveyResults] = await Promise.all([
                this.get('/survey-answer/?limit=-1'), 
                this.get('/survey-result/?limit=-1')
            ]);
            dispatch(surveyActions.setSurveyAnswers(surveyAnswers?.results || []));
            dispatch(surveyActions.setSurveyResults(surveyResults?.results || []));
            dispatch(surveyActions.setStatus('complete'));
        } catch(error) {
            dispatch(surveyActions.setStatus('failed'));
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

    async getQuestions() {
        dispatch(questionActions.setStatus('loading'));
        try {
            const data = await this.get('/question/?limit=-1');
            dispatch(questionActions.setQuestions(data?.results || []));
            const options = await this.get('/option/?limit=-1');
            dispatch(questionActions.setOptions(options?.results || []));
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
            dispatch(questionActions.setStatus('failed'));
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

    async removeUsers(projectId, body) {
        return this.post(`/project/${projectId}/remove_users/`, body);
    }

    async upsertUsers(projectId, body) {
        return this.post(`/project/${projectId}/update_or_add_users/`, body);
    }
}

const ApiService = new Api();

export default ApiService;
