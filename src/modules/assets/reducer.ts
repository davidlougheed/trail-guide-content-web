import {ADD_ASSET, DELETE_ASSET, FETCH_ASSETS} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

import type {Asset} from "./types";

export default makeGenericNetworkReducer<Asset>(FETCH_ASSETS, ADD_ASSET, undefined, DELETE_ASSET);
