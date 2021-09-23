import {ADD_ASSET, FETCH_ASSETS, UPDATE_ASSET} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

export default makeGenericNetworkReducer(FETCH_ASSETS, ADD_ASSET, UPDATE_ASSET);
