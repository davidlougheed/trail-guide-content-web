import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_SETTINGS = networkActionTypes("FETCH_SETTINGS");
export const UPDATE_SETTINGS = networkActionTypes("UPDATE_SETTINGS");

const fetchSettings = networkAction(FETCH_SETTINGS, "/settings");
export const fetchSettingsIfNeeded = makeIfNeededAction(fetchSettings, "settings");

export const updateSettings = (settingsData, accessToken) => (dispatch, getState) => {
  if (getState().settings.isFetching || getState().settings.isUpdating) return;
  return dispatch(networkAction(UPDATE_SETTINGS, `/settings`, "PUT")(settingsData, {}, accessToken));
}
