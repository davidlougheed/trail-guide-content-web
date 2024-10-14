import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

import type {AppDispatch, RootState, RootStateGetter} from "../../store";
import {Station, StationUpdate} from "./types";

export const FETCH_STATIONS = networkActionTypes("FETCH_STATIONS");
export const ADD_STATION = networkActionTypes("ADD_STATION");
export const UPDATE_STATION = networkActionTypes("UPDATE_STATION");
export const DELETE_STATION = networkActionTypes("DELETE_STATION");

const fetchStations = networkAction<Station>(FETCH_STATIONS, "/stations");
export const fetchStationsIfNeeded = makeIfNeededAction(fetchStations, "stations");

const _check = (state: RootState)=> !(
  state.stations.isFetching ||
  state.stations.isAdding ||
  state.stations.isUpdating ||
  state.stations.isDeleting
);

const _addStation = networkAction<Station, Station>(ADD_STATION, "/stations", "POST");
export const addStation = (body: Station, accessToken: string) =>
  (dispatch: AppDispatch, getState: RootStateGetter) => {
    const state = getState();
    if (!_check(state)) return;
    return dispatch(_addStation(body, {}, accessToken));
  };

export const updateStation = (stationID: string, stationData: StationUpdate, accessToken: string) =>
  (dispatch: AppDispatch, getState: RootStateGetter) => {
    const state = getState();
    if (!_check(state)) return;
    return dispatch(networkAction<Station, StationUpdate>(UPDATE_STATION, `/stations/${stationID}`, "PUT")(
      stationData, {}, accessToken));
  };

export const deleteStation = (stationID: string, accessToken: string) =>
  (dispatch: AppDispatch, getState: RootStateGetter) => {
    const state = getState();
    if (!_check(state)) return;
    return dispatch(networkAction(DELETE_STATION, `/stations/${stationID}`, "DELETE")(
      {}, {id: stationID}, accessToken));
  };
