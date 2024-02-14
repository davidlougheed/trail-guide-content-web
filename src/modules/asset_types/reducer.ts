import {ADD_ASSET_TYPE, FETCH_ASSET_TYPES, UPDATE_ASSET_TYPE} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

import type {AssetType} from "./types";

export default makeGenericNetworkReducer<AssetType>(FETCH_ASSET_TYPES, ADD_ASSET_TYPE, UPDATE_ASSET_TYPE);
