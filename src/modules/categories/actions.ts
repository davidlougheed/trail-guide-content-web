// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_CATEGORIES = networkActionTypes("FETCH_CATEGORIES");
export const ADD_CATEGORY = networkActionTypes("ADD_CATEGORY");
export const UPDATE_CATEGORY = networkActionTypes("UPDATE_CATEGORY");
export const DELETE_CATEGORY = networkActionTypes("DELETE_CATEGORY");

const fetchCategories = networkAction<string[]>(FETCH_CATEGORIES, "/categories");
export const fetchCategoriesIfNeeded = makeIfNeededAction<string[]>(fetchCategories, "categories");
