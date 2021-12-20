import {ADD_LAYER, FETCH_LAYERS, UPDATE_LAYER} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

export default makeGenericNetworkReducer(FETCH_LAYERS, ADD_LAYER, UPDATE_LAYER);
