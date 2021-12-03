import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_ASSETS = networkActionTypes("FETCH_ASSETS");
export const ADD_ASSET = networkActionTypes("ADD_ASSET");
export const UPDATE_ASSET = networkActionTypes("UPDATE_ASSET");

const fetchAssets = networkAction(FETCH_ASSETS, "/assets");
export const fetchAssetsIfNeeded = makeIfNeededAction(fetchAssets, "assets");

const _addAsset = networkAction(ADD_ASSET, "/assets", "POST", true);
export const addAsset = (body, accessToken) => (dispatch, getState) => {
  const state = getState();
  if (state.isFetching || state.isAdding || state.isUpdating) return;
  return dispatch(_addAsset(body, {}, accessToken));
};
