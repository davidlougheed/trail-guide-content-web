import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_LAYERS = networkActionTypes("FETCH_LAYERS");
export const ADD_LAYER = networkActionTypes("ADD_LAYER");
export const UPDATE_LAYER = networkActionTypes("UPDATE_LAYER");
export const DELETE_LAYER = networkActionTypes("DELETE_LAYER");

const fetchLayers = networkAction(FETCH_LAYERS, "/layers");
export const fetchLayersIfNeeded = makeIfNeededAction(fetchLayers, "layers");

const _addLayer = networkAction(ADD_LAYER, "/layers", "POST");
export const addLayer = (body, accessToken) => (dispatch, getState) => {
  const state = getState();
  if (state.isFetching || state.isAdding || state.isUpdating || state.isDeleting) return;
  return dispatch(_addLayer(body, {}, accessToken));
};

export const updateLayer = (layerID, layerData, accessToken) => (dispatch, getState) => {
  const state = getState();
  if (state.isFetching || state.isAdding || state.isUpdating || state.isDeleting) return;
  return dispatch(networkAction(UPDATE_LAYER, `/layers/${layerID}`, "PUT")(layerData, {}, accessToken));
};

export const deleteLayer = (layerID, accessToken) => (dispatch, getState) => {
  const state = getState();
  if (state.isFetching || state.isAdding || state.isUpdating || state.isDeleting) return;
  return dispatch(networkAction(DELETE_LAYER, `/layers/${layerID}`, "DELETE")(
    {}, {id: layerID}, accessToken));
};
