// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";
import type {Settings} from "./types";
import type {AppDispatch, RootState} from "../../store";

export const FETCH_SETTINGS = networkActionTypes("FETCH_SETTINGS");
export const UPDATE_SETTINGS = networkActionTypes("UPDATE_SETTINGS");

const fetchSettings = networkAction(FETCH_SETTINGS, "/settings");
export const fetchSettingsIfNeeded = makeIfNeededAction(fetchSettings, "settings");

export const updateSettings = (settingsData: Settings, accessToken: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (getState().settings.isFetching || getState().settings.isUpdating) return;
    return dispatch(networkAction(UPDATE_SETTINGS, `/settings`, "PUT")(settingsData, {}, accessToken));
  }
