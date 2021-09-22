import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_SETTINGS = networkActionTypes("FETCH_SETTINGS");

const fetchSettings = networkAction(FETCH_SETTINGS, "/settings");
export const fetchSettingsIfNeeded = makeIfNeededAction(fetchSettings, "settings");
