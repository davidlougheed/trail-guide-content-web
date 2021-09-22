import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_STATIONS = networkActionTypes("FETCH_STATIONS");

const fetchStations = networkAction(FETCH_STATIONS, "/stations");
export const fetchStationsIfNeeded = makeIfNeededAction(fetchStations, "stations");
