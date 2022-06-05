import {PERFORM_SEARCH} from "./actions";

export default (
  state = {
    isFetching: false,
    data: {},
    error: "",
  },
  action,
) => {
  switch (action.type) {
    case PERFORM_SEARCH.REQUEST:
      return {...state, isFetching: true};
    case PERFORM_SEARCH.RECEIVE:
      return {...state, isFetching: false, data: action.data, error: ""};
    case PERFORM_SEARCH.ERROR:
      return {...state, isFetching: false, error: action.message};

    default:
      return state;
  }
};
