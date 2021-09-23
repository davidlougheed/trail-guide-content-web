import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_CATEGORIES = networkActionTypes("FETCH_CATEGORIES");
export const ADD_CATEGORY = networkActionTypes("ADD_CATEGORY");
export const UPDATE_CATEGORY = networkActionTypes("UPDATE_CATEGORY");

const fetchCategories = networkAction(FETCH_CATEGORIES, "/categories");
export const fetchCategoriesIfNeeded = makeIfNeededAction(fetchCategories, "categories");
