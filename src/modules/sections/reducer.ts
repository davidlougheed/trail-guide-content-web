import {ADD_SECTION, FETCH_SECTIONS, UPDATE_SECTION} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

import type {Section} from "./types";

export default makeGenericNetworkReducer<Section>(FETCH_SECTIONS, ADD_SECTION, UPDATE_SECTION);
