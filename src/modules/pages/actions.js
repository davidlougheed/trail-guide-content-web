import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_PAGES = networkActionTypes("FETCH_PAGES");

const fetchPages = networkAction(FETCH_PAGES, "/pages");
export const fetchPagesIfNeeded = makeIfNeededAction(fetchPages, "pages");
