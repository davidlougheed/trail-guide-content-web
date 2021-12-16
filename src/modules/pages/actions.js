import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_PAGES = networkActionTypes("FETCH_PAGES");
export const ADD_PAGE = networkActionTypes("ADD_PAGE");
export const UPDATE_PAGE = networkActionTypes("UPDATE_PAGE");

const fetchPages = networkAction(FETCH_PAGES, "/pages");
export const fetchPagesIfNeeded = makeIfNeededAction(fetchPages, "pages");

export const updatePage = (pageID, pageData, accessToken) => (dispatch, getState) => {
  const state = getState();
  if (state.isFetching || state.isAdding || state.isUpdating) return;
  return dispatch(networkAction(UPDATE_PAGE, `/pages/${pageID}`, "PUT")(pageData, {}, accessToken));
};
