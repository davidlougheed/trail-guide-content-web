import {networkAction, networkActionTypes} from "../../utils";

export const PERFORM_SEARCH = networkActionTypes("PERFORM_SEARCH");
export const performSearch = networkAction(PERFORM_SEARCH, "/search");
