import {ADD_LAYER, FETCH_LAYERS, UPDATE_LAYER, DELETE_LAYER} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

import type {Layer} from "./types";

export default makeGenericNetworkReducer<Layer>(FETCH_LAYERS, ADD_LAYER, UPDATE_LAYER, DELETE_LAYER);
