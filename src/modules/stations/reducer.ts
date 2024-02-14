import {FETCH_STATIONS, ADD_STATION, UPDATE_STATION, DELETE_STATION} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

import type {Station} from "./types";

export default makeGenericNetworkReducer<Station>(FETCH_STATIONS, ADD_STATION, UPDATE_STATION, DELETE_STATION);
