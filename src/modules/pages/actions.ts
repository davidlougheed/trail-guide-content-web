import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";
import type {AppDispatch, RootStateGetter} from "../../store";

export const FETCH_PAGES = networkActionTypes("FETCH_PAGES");
export const ADD_PAGE = networkActionTypes("ADD_PAGE");
export const UPDATE_PAGE = networkActionTypes("UPDATE_PAGE");

const fetchPages = networkAction(FETCH_PAGES, "/pages");
export const fetchPagesIfNeeded = makeIfNeededAction(fetchPages, "pages");

export const updatePage = (pageID: string, pageData, accessToken: string) =>
  (dispatch: AppDispatch, getState: RootStateGetter) => {
    const state = getState();
    if (state.pages.isFetching || state.pages.isAdding || state.pages.isUpdating) return;
    return dispatch(networkAction(UPDATE_PAGE, `/pages/${pageID}`, "PUT")(pageData, {}, accessToken));
  };
