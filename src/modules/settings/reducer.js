import {FETCH_SETTINGS} from "./actions";

export default (
    state = {
        isFetching: false,
        data: {},
        error: "",
    },
    action,
) => {
    switch (action.type) {
        case FETCH_SETTINGS.REQUEST:
            return {...state, isFetching: true};
        case FETCH_SETTINGS.RECEIVE:
            return {...state, data: action.data, error: ""};
        case FETCH_SETTINGS.ERROR:
            return {...state, error: action.message};
        default:
            return state;
    }
};
