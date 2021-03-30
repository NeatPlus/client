import {useRef, useReducer, useEffect} from 'react';

import {request} from 'services/api';

const useRequest = (url, options, body) => {
    const cache = useRef({});

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

    useEffect(() => {
        let cancelRequest = false;
        if(!url) {
            return;
        }

        const fetchData = async () => {
            dispatch({type: 'FETCHING'});
            if(cache.current[url]) {
                const {data, response} = cache.current[url];
                dispatch({type: 'FETCHED', data, response});
            } else {
                try {
                    let requestOptions = {};
                    if(options?.method && options?.method!=='GET') {
                        requestOptions = {
                            method: options.method,
                            headers: options.headers || {'content-type': 'application/json'},
                            body: options.headers ? body : JSON.stringify(body), 
                        };
                    }
                    const {error, data, response} = await request(`/api/v1${url}`, requestOptions);
                    cache.current[url] = {data, response};
                    if(cancelRequest) {
                        return;
                    }
                    if(response.status === 500) {
                        throw new Error('500 Internal Server Error');
                    }
                    if(error) {
                        console.log(data);
                        throw data || new Error('Request Error');
                    }
                    dispatch({type: 'FETCHED', data, response});
                } catch (err) {
                    if(cancelRequest) {
                        return;
                    }
                    dispatch({type: 'FETCH_ERROR', err});
                }
            }
        };

        fetchData();

        return () => {
            cancelRequest=true;
        };
    }, [url, options, body]);

    return state;
};

export default useRequest;
