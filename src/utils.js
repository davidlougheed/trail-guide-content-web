import {BASE_URL} from "./config";

export const networkActionTypes = name => ({
    REQUEST: `${name}.REQUEST`,
    RECEIVE: `${name}.RECEIVE`,
    ERROR: `${name}.ERROR`,
});

export const networkAction = (types, url, method="GET", params={}, body={}) => () =>
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
                await dispatch({type: types.RECEIVE, data, params});
            } else {
                await dispatch({
                    params,
                    type: types.ERROR,
                    message: `Request encountered error status: ${r.message}`,
                });
            }
        } catch (error) {
            await dispatch({type: types.ERROR, message: error.toString()});
        }
    };

export const makeIfNeededAction = (action, reducer) => () => (dispatch, getState) => {
    if (getState()[reducer]?.isFetching) return;
    return dispatch(action());
};

export const makeGenericNetworkReducer = (actionTypes) => (
    state = {
        isFetching: false,
        items: [],
        error: "",
    },
    action,
) => {
    switch (action.type) {
        case actionTypes.REQUEST:
            return {...state, isFetching: true};
        case actionTypes.RECEIVE:
            return {...state, items: action.data, error: ""};
        case actionTypes.ERROR:
            return {...state, error: action.message};
        default:
            return state;
    }
};
