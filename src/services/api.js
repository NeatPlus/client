import RequestBuilder from '@ra/services/request';
import store from 'store';

import * as authActions from 'store/actions/auth';
import * as organizationActions from 'store/actions/organization';
import * as projectActions from 'store/actions/project';

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

    async getOrganizations() {
        try {
            const data = await this.get('/organization/');
            dispatch(organizationActions.setOrganizations(data?.results || []));
        } catch(error) {
            console.log(error);
        }
    }

    async getProjects() {
        try {
            const data = await this.get('/project/');
            dispatch(projectActions.setProjects(data?.results || []));
        } catch(error) {
            console.log(error);
        }
    }
}

const ApiService = new Api();

export default ApiService;
