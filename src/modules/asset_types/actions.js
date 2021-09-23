import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_ASSET_TYPES = networkActionTypes("FETCH_ASSET_TYPES");
export const ADD_ASSET_TYPE = networkActionTypes("ADD_ASSET_TYPE");
export const UPDATE_ASSET_TYPE = networkActionTypes("UPDATE_ASSET_TYPE");

const fetchAssetTypes = networkAction(FETCH_ASSET_TYPES, "/asset_types");
export const fetchAssetTypesIfNeeded = makeIfNeededAction(fetchAssetTypes, "assetTypes");
