import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_RELEASES = networkActionTypes("FETCH_RELEASES");
export const ADD_RELEASE = networkActionTypes("ADD_RELEASE");
export const UPDATE_RELEASE = networkActionTypes("UPDATE_RELEASE");

const fetchReleases = networkAction(FETCH_RELEASES, "/releases");
export const fetchReleasesIfNeeded = makeIfNeededAction(fetchReleases, "releases");

const _addRelease = networkAction(ADD_RELEASE, "/releases", "POST");
export const addRelease = (body, accessToken) => (dispatch, getState) => {
  const state = getState();
  if (state.isFetching || state.isAdding || state.isUpdating) return;
  return dispatch(_addRelease(body, {}, accessToken));
};

export const updateRelease = (version, releaseData, accessToken) => (dispatch, getState) => {
  const state = getState();
  if (state.isFetching || state.isAdding || state.isUpdating) return;
  return dispatch(networkAction(UPDATE_RELEASE, `/releases/${version}`, "PUT")(
    releaseData, {}, accessToken));
};
