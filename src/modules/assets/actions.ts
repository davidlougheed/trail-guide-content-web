import type {ThunkAction} from "redux-thunk";
import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";
import type {RootState} from "../../store";

import type {Asset} from "./types";

export const FETCH_ASSETS = networkActionTypes("FETCH_ASSETS");
export const ADD_ASSET = networkActionTypes("ADD_ASSET");
export const DELETE_ASSET = networkActionTypes("DELETE_ASSET");

const fetchAssets = networkAction(FETCH_ASSETS, "/assets");
export const fetchAssetsIfNeeded = makeIfNeededAction(fetchAssets, "assets");

const _addAsset = networkAction<Asset, FormData>(ADD_ASSET, "/assets", "POST");
export const addAsset = (body: FormData, accessToken: string): ThunkAction<any, RootState, unknown, any> =>
  (dispatch, getState) => {
    const state = getState();
    if (state.assets.isFetching || state.assets.isAdding || state.assets.isUpdating || state.assets.isDeleting) return;
    return dispatch(_addAsset(body, {}, accessToken));
  };

export const deleteAsset = (assetID: string, accessToken: string): ThunkAction<any, RootState, unknown, any> =>
  (dispatch, getState) => {
    const state = getState();
    if (state.assets.isFetching || state.assets.isAdding || state.assets.isUpdating || state.assets.isDeleting) return;
    return dispatch(networkAction<{message: string}>(DELETE_ASSET, `/assets/${assetID}`, "DELETE")(
      {}, {id: assetID}, accessToken));
  };
