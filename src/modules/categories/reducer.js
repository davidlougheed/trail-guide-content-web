import {ADD_CATEGORY, FETCH_CATEGORIES, UPDATE_CATEGORY} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

export default makeGenericNetworkReducer(FETCH_CATEGORIES, ADD_CATEGORY, UPDATE_CATEGORY);
