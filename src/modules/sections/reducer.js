import {ADD_SECTION, FETCH_SECTIONS, UPDATE_SECTION} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

export default makeGenericNetworkReducer(FETCH_SECTIONS, ADD_SECTION, UPDATE_SECTION);
