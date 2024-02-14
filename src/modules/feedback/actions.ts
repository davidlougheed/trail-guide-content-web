import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_FEEDBACK = networkActionTypes("FETCH_FEEDBACK");

const fetchFeedback = networkAction(FETCH_FEEDBACK, "/feedback");
export const fetchFeedbackIfNeeded = makeIfNeededAction(fetchFeedback, "feedback");
