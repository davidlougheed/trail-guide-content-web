import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_SECTIONS = networkActionTypes("FETCH_SECTIONS");

const fetchSections = networkAction(FETCH_SECTIONS, "/sections");
export const fetchSectionsIfNeeded = makeIfNeededAction(fetchSections, "sections");
