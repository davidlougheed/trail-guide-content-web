import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_ASSETS = networkActionTypes("FETCH_ASSETS");
export const ADD_ASSET = networkActionTypes("ADD_ASSET");
export const UPDATE_ASSET = networkActionTypes("UPDATE_ASSET");

const fetchAssets = networkAction(FETCH_ASSETS, "/assets");
export const fetchAssetsIfNeeded = makeIfNeededAction(fetchAssets, "assets");

export const addAsset = asset => dispatch => {
    // TODO
    console.error("UNIMPLEMENTED");
};
