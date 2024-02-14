import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

import type {Section} from "./types";

export const FETCH_SECTIONS = networkActionTypes("FETCH_SECTIONS");
export const ADD_SECTION = networkActionTypes("ADD_SECTION");
export const UPDATE_SECTION = networkActionTypes("UPDATE_SECTION");

const fetchSections = networkAction<{}, Section>(FETCH_SECTIONS, "/sections");
export const fetchSectionsIfNeeded = makeIfNeededAction(fetchSections, "sections");
