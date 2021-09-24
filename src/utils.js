import {message} from "antd";

import {BASE_URL} from "./config";

export const networkActionTypes = name => ({
    REQUEST: `${name}.REQUEST`,
    RECEIVE: `${name}.RECEIVE`,
    ERROR: `${name}.ERROR`,
});

export const networkAction = (types, url, method="GET") => (body={}, params={}) =>
    async dispatch => {
        await dispatch({params, type: types.REQUEST});

        try {
            const r = await fetch(BASE_URL + url,
                {
                    method,
                    headers: {
                        "Content-Type": "application/json",  // TODO: asset
                    },
                    ...(Object.keys(body).length ? {body: JSON.stringify(body)} : {})
                });

            if (r.ok) {
                const data = await r.json();
                dispatch({type: types.RECEIVE, data, params});
                return {error: false, data};
            } else {
                const err = `Request to ${url} encountered error status: ${r.message}`;
                message.error(err);
                dispatch({
                    params,
                    type: types.ERROR,
                    message: err,
                });
                return {error: true, message: err};
            }
        } catch (error) {
            const err = `Request to ${url} encountered thrown error: ${error.toString()}`;
            message.error(err);
            dispatch({type: types.ERROR, message: err});
            return {error: true, message: err};
        }
    };

export const makeIfNeededAction = (action, reducer) => () => (dispatch, getState) => {
    if (getState()[reducer]?.isFetching) return;
    return dispatch(action());
};

export const makeGenericNetworkReducer = (fetchTypes, addTypes, updateTypes) => (
    state = {
        isFetching: false,
        isAdding: false,
        isUpdating: false,
        items: [],
        error: "",
    },
    action,
) => {
    switch (action.type) {
        case fetchTypes.REQUEST:
            return {...state, isFetching: true};
        case fetchTypes.RECEIVE:
            return {...state, isFetching: false, items: action.data, error: ""};
        case fetchTypes.ERROR:
            return {...state, isFetching: false, error: action.message};

        case addTypes.REQUEST:
            return {...state, isAdding: true};
        case addTypes.RECEIVE:
            return {...state, isAdding: false, items: [...state.items, action.data], error: ""};
        case addTypes.ERROR:
            return {...state, isAdding: false, error: action.message};

        case updateTypes.REQUEST:
            return {...state, isUpdating: true};
        case updateTypes.RECEIVE:
            return {
                ...state,
                isUpdating: false,
                items: state.items.map(i => i.id === action.data.id ? action.data : i),
                error: "",
            };
        case updateTypes.ERROR:
            return {...state, isUpdating: false, error: action.message};

        default:
            return state;
    }
};
