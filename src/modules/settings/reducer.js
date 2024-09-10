import {FETCH_SETTINGS, UPDATE_SETTINGS} from "./actions";

export default (
  state = {
    initialFetchDone: false,
    isFetching: false,
    isUpdating: false,
    data: null,
    error: "",
  },
  action,
) => {
  switch (action.type) {
    case FETCH_SETTINGS.REQUEST:
      return {...state, isFetching: true};
    case FETCH_SETTINGS.RECEIVE:
      return {...state, isFetching: false, initialFetchDone: true, data: action.data, error: ""};
    case FETCH_SETTINGS.ERROR:
      return {...state, isFetching: false, error: action.message};

    case UPDATE_SETTINGS.REQUEST:
      return {...state, isUpdating: true};
    case UPDATE_SETTINGS.RECEIVE:
      return {...state, isUpdating: false, data: action.data, error: ""};
    case UPDATE_SETTINGS.ERROR:
      return {...state, isUpdating: false, error: action.message};

    default:
      return state;
  }
};
