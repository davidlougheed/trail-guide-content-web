import {ADD_MODAL, FETCH_MODALS, UPDATE_MODAL} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

export default makeGenericNetworkReducer(FETCH_MODALS, ADD_MODAL, UPDATE_MODAL);
