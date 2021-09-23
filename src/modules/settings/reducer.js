import {FETCH_SETTINGS, UPDATE_SETTINGS} from "./actions";

export default (
    state = {
        isFetching: false,
        isUpdating: false,
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

        case UPDATE_SETTINGS.REQUEST:
            return {...state, isUpdating: true};
        case UPDATE_SETTINGS.RECEIVE:
            return {...state, data: action.data, error: ""};
        case UPDATE_SETTINGS.ERROR:
            return {...state, error: action.message};

        default:
            return state;
    }
};
