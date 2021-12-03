// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import {message} from "antd";

import {AUTH_AUDIENCE, BASE_URL} from "./config";

export const ACCESS_TOKEN_READ = {
    audience: AUTH_AUDIENCE,
    scope: "read:content",
};

export const ACCESS_TOKEN_MANAGE = {
    audience: AUTH_AUDIENCE,
    scope: "manage:content",
};

export const fetchOtt = async (accessToken, setOtt) => {
    const req = await fetch(`${BASE_URL}/ott`, {
        method: "POST",
        headers: {"Authorization": `Bearer ${accessToken}`},
    });

    if (req.ok) {
        return await req.json();
    } else {
        console.error("Failed to get OTT", req);
    }
};

export const assetIdToBytesUrl = assetId => `${BASE_URL}/assets/${assetId}/bytes`;

export const networkActionTypes = name => ({
    REQUEST: `${name}.REQUEST`,
    RECEIVE: `${name}.RECEIVE`,
    ERROR: `${name}.ERROR`,
});

export const networkAction = (types, url, method="GET", multipart=false) =>
    (body={}, params={}, accessToken="") => async dispatch => {
        await dispatch({params, type: types.REQUEST});

        const authHeaders = accessToken === "" ? {} : {
            "Authorization": `Bearer ${accessToken}`,
        };

        try {
            const r = await fetch(BASE_URL + url,
                {
                    method,
                    ...(multipart ? {
                        // Don't set content type manually for uploading multipart/form-data
                        headers: authHeaders,
                        body,
                    } : {
                        headers: {
                            "Content-Type": "application/json",
                            ...authHeaders,
                        },
                        ...(Object.keys(body).length ? {body: JSON.stringify(body)} : {}),
                    }),
                });

            const data = await r.json();

            if (r.ok) {
                dispatch({type: types.RECEIVE, data, params});
                return {error: false, data};
            } else {
                const err = `Request to ${url} encountered error status: ${data.message}`;
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

export const makeIfNeededAction = (action, reducer) => (...args) => (dispatch, getState) => {
    if (getState()[reducer]?.isFetching) return;
    return dispatch(action(...args));
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
    }

    if (addTypes) {
        switch (action.type) {
            case addTypes.REQUEST:
                return {...state, isAdding: true};
            case addTypes.RECEIVE:
                return {...state, isAdding: false, items: [...state.items, action.data], error: ""};
            case addTypes.ERROR:
                return {...state, isAdding: false, error: action.message};
        }
    }

    if (updateTypes) {
        switch (action.type) {
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
        }
    }

    return state;
};


export const findItemByID = (items, id) => items.find(obj => obj.id.toString() === id.toString());
