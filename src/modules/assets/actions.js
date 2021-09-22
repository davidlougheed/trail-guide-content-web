import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_ASSETS = networkActionTypes("FETCH_ASSETS");

const fetchAssets = networkAction(FETCH_ASSETS, "/assets");
export const fetchAssetsIfNeeded = makeIfNeededAction(fetchAssets, "assets");
