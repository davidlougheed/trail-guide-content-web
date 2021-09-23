import {ADD_PAGE, FETCH_PAGES, UPDATE_PAGE} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

export default makeGenericNetworkReducer(FETCH_PAGES, ADD_PAGE, UPDATE_PAGE);
