import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_ASSET_TYPES = networkActionTypes("FETCH_ASSET_TYPES");

const fetchAssetTypes = networkAction(FETCH_ASSET_TYPES, "/asset_types");
export const fetchAssetTypesIfNeeded = makeIfNeededAction(fetchAssetTypes, "assetTypes");
