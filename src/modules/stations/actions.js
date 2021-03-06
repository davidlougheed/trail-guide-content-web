import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_STATIONS = networkActionTypes("FETCH_STATIONS");
export const ADD_STATION = networkActionTypes("ADD_STATION");
export const UPDATE_STATION = networkActionTypes("UPDATE_STATION");
export const DELETE_STATION = networkActionTypes("DELETE_STATION");

const fetchStations = networkAction(FETCH_STATIONS, "/stations");
export const fetchStationsIfNeeded = makeIfNeededAction(fetchStations, "stations");

const _addStation = networkAction(ADD_STATION, "/stations", "POST");
export const addStation = (body, accessToken) => (dispatch, getState) => {
  const state = getState();
  if (state.isFetching || state.isAdding || state.isUpdating || state.isDeleting) return;
  return dispatch(_addStation(body, {}, accessToken));
};

export const updateStation = (stationID, stationData, accessToken) => (dispatch, getState) => {
  const state = getState();
  if (state.isFetching || state.isAdding || state.isUpdating || state.isDeleting) return;
  return dispatch(networkAction(UPDATE_STATION, `/stations/${stationID}`, "PUT")(
    stationData, {}, accessToken));
};

export const deleteStation = (stationID, accessToken) => (dispatch, getState) => {
  const state = getState();
  if (state.isFetching || state.isAdding || state.isUpdating || state.isDeleting) return;
  return dispatch(networkAction(DELETE_STATION, `/stations/${stationID}`, "DELETE")(
    {}, {id: stationID}, accessToken));
};
