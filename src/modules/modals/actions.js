import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_MODALS = networkActionTypes("FETCH_MODALS");

const fetchModals = networkAction(FETCH_MODALS, "/modals");
export const fetchModalsIfNeeded = makeIfNeededAction(fetchModals, "modals");
