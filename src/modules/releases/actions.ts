import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../../store";

export const FETCH_RELEASES = networkActionTypes("FETCH_RELEASES");
export const ADD_RELEASE = networkActionTypes("ADD_RELEASE");

const fetchReleases = networkAction(FETCH_RELEASES, "/releases");
export const fetchReleasesIfNeeded = makeIfNeededAction(fetchReleases, "releases");

const _addRelease = networkAction(ADD_RELEASE, "/releases", "POST");
export const addRelease = (body, accessToken: string): ThunkAction<any, RootState, unknown, any> =>
  (dispatch, getState) => {
    const state = getState();
    if (state.releases.isFetching || state.releases.isAdding || state.releases.isUpdating) return;
    return dispatch(_addRelease(body, {}, accessToken));
  };
