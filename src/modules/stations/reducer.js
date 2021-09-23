import {FETCH_STATIONS, ADD_STATION, UPDATE_STATION} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

export default makeGenericNetworkReducer(FETCH_STATIONS, ADD_STATION, UPDATE_STATION);
