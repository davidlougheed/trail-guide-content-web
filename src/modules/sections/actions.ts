import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

import type {Section} from "./types";
import type {AppDispatch, RootState, RootStateGetter} from "../../store";

export const FETCH_SECTIONS = networkActionTypes("FETCH_SECTIONS");
export const ADD_SECTION = networkActionTypes("ADD_SECTION");
export const UPDATE_SECTION = networkActionTypes("UPDATE_SECTION");
export const DELETE_SECTION = networkActionTypes("DELETE_SECTION");

const fetchSections = networkAction<Section>(FETCH_SECTIONS, "/sections");
export const fetchSectionsIfNeeded = makeIfNeededAction(fetchSections, "sections");

const _check = (state: RootState) => !(
  state.sections.isFetching ||
  state.sections.isAdding ||
  state.sections.isUpdating ||
  state.sections.isDeleting
);

export const addSection = (sectionID: string, sectionData: Section, accessToken: string) =>
  (dispatch: AppDispatch, getState: RootStateGetter) => {
    const state = getState();
    if (!_check(state)) return;
    return dispatch(networkAction<Section, Section>(ADD_SECTION, `/sections/${sectionID}`, "PUT")(
      sectionData, {}, accessToken));
  };

export const updateSection = (sectionID: string, sectionData: Section, accessToken: string) =>
  (dispatch: AppDispatch, getState: RootStateGetter) => {
    const state = getState();
    if (!_check(state)) return;
    return dispatch(networkAction<Section, Section>(UPDATE_SECTION, `/sections/${sectionID}`, "PUT")(
      sectionData, {}, accessToken));
  };

export const deleteSection = (sectionID: string, accessToken: string) =>
  (dispatch: AppDispatch, getState: RootStateGetter) => {
    const state = getState();
    if (!_check(state)) return;
    return dispatch(networkAction(DELETE_SECTION, `/sections/${sectionID}`, "DELETE")(
      {}, {id: sectionID}, accessToken));
  };
