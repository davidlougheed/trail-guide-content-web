import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

import type {Station} from "./types";

export const FETCH_STATIONS = networkActionTypes("FETCH_STATIONS");
export const ADD_STATION = networkActionTypes("ADD_STATION");
export const UPDATE_STATION = networkActionTypes("UPDATE_STATION");
export const DELETE_STATION = networkActionTypes("DELETE_STATION");

const fetchStations = networkAction<{}, Station>(FETCH_STATIONS, "/stations");
export const fetchStationsIfNeeded = makeIfNeededAction(fetchStations, "stations");

const _addStation = networkAction<Station, Station>(ADD_STATION, "/stations", "POST");
export const addStation = (body, accessToken) => (dispatch, getState) => {
  const state = getState();
  if (state.isFetching || state.isAdding || state.isUpdating || state.isDeleting) return;
  return dispatch(_addStation(body, {}, accessToken));
};

export const updateStation = (stationID: string, stationData, accessToken: string) => (dispatch, getState) => {
  const state = getState();
  if (state.isFetching || state.isAdding || state.isUpdating || state.isDeleting) return;
  return dispatch(networkAction(UPDATE_STATION, `/stations/${stationID}`, "PUT")(
    stationData, {}, accessToken));
};

export const deleteStation = (stationID: string, accessToken: string) => (dispatch, getState) => {
  const state = getState();
  if (state.isFetching || state.isAdding || state.isUpdating || state.isDeleting) return;
  return dispatch(networkAction(DELETE_STATION, `/stations/${stationID}`, "DELETE")(
    {}, {id: stationID}, accessToken));
};
