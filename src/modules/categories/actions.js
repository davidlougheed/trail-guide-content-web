import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_CATEGORIES = networkActionTypes("FETCH_CATEGORIES");

const fetchCategories = networkAction(FETCH_CATEGORIES, "/categories");
export const fetchCategoriesIfNeeded = makeIfNeededAction(fetchCategories, "categories");
