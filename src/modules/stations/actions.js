import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_STATIONS = networkActionTypes("FETCH_STATIONS");
export const ADD_STATION = networkActionTypes("ADD_STATION");
export const UPDATE_STATION = networkActionTypes("UPDATE_STATION");

const fetchStations = networkAction(FETCH_STATIONS, "/stations");
export const fetchStationsIfNeeded = makeIfNeededAction(fetchStations, "stations");

const _addStation = networkAction(ADD_STATION, "/stations", "POST");
export const addStation = body => (dispatch, getState) => {
    const state = getState();
    if (state.isFetching || state.isAdding || state.isUpdating) return;
    return _addStation(body);
};

export const updateStation = (stationID, stationData) => (dispatch, getState) => {
    const state = getState();
    if (state.isFetching || state.isAdding || state.isUpdating) return;
    return dispatch(networkAction(UPDATE_STATION, `/stations/${stationID}`, "PUT")(stationData));
}
