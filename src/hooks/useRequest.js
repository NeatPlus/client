import {useReducer, useCallback} from 'react';
import {_} from 'services/i18n';

import {request} from 'services/api';

let apiVersion = process.env.REACT_APP_API_VERSION || 'v1';

const useRequest = (url, options, body) => {
    const initialState = {
        loading: false,
        error: false,
        data: null,
        response: null,
    };

    const [state, dispatch] = useReducer((state, action) => {
        switch(action.type) {
        case 'FETCHING':
            return {...initialState, loading: true};
        case 'FETCHED':
            return {...initialState, data: action.data, response: action.response};
        case 'FETCH_ERROR':
            return {...initialState, error: action.error};
        default: 
            return state;
        }
    }, initialState);

    const callApi = useCallback(async (body, callOptions) => {
        const shouldReturnData = options?.method && options?.method !== 'GET';

        if(!url) {
            return;
        }

        dispatch({type: 'FETCHING'});
        try {
            let requestOptions = {};
            if(options?.method && options?.method!=='GET') {
                requestOptions = {
                    method: options.method,
                    headers: options.headers || {'content-type': 'application/json'},
                    body: options.headers ? body : JSON.stringify(body), 
                };
            }
            const {error, data, response} = await request(
                url.startsWith('http')
                    ? url 
                    : `/api/${apiVersion}${url}`, requestOptions
            );
            if(response.status === 500) {
                throw new Error(_('500 Internal Server Error'));
            }
            if(error || !response.ok) {
                throw data || new Error(_('Request Error'));
            }
            dispatch({type: 'FETCHED', data, response});
            if(shouldReturnData) {
                return data;
            }
        } catch (err) {
            dispatch({type: 'FETCH_ERROR', err});
            if(shouldReturnData) {
                throw err;
            }
        }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url, options],
    );

    return [state, callApi];
};

export default useRequest;
