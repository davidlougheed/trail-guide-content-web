// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import type {AppDispatch, RootState, RootStateGetter} from "../../store";
import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";
import type {Category} from "./types";

export const FETCH_CATEGORIES = networkActionTypes("FETCH_CATEGORIES");
export const ADD_CATEGORY = networkActionTypes("ADD_CATEGORY");
export const UPDATE_CATEGORY = networkActionTypes("UPDATE_CATEGORY");
export const DELETE_CATEGORY = networkActionTypes("DELETE_CATEGORY");

const fetchCategories = networkAction<string[]>(FETCH_CATEGORIES, "/categories");
export const fetchCategoriesIfNeeded = makeIfNeededAction<string[]>(fetchCategories, "categories");

const _check = (state: RootState) => !(
  state.categories.isFetching ||
  state.categories.isAdding ||
  state.categories.isUpdating ||
  state.categories.isDeleting
);

export const addCategory = (categoryID: string, categoryData: Category, accessToken: string) =>
  (dispatch: AppDispatch, getState: RootStateGetter) => {
    const state = getState();
    if (!_check(state)) return;
    return dispatch(networkAction<Category, Category>(ADD_CATEGORY, `/categories/${categoryID}`, "PUT")(
      categoryData, {}, accessToken));
  };

export const updateCategory = (categoryID: string, categoryData: Category, accessToken: string) =>
  (dispatch: AppDispatch, getState: RootStateGetter) => {
    const state = getState();
    if (!_check(state)) return;
    return dispatch(networkAction<Category, Category>(UPDATE_CATEGORY, `/categories/${categoryID}`, "PUT")(
      categoryData, {}, accessToken));
  };

export const deleteCategory = (categoryID: string, accessToken: string) =>
  (dispatch: AppDispatch, getState: RootStateGetter) => {
    const state = getState();
    if (!_check(state)) return;
    return dispatch(networkAction(DELETE_CATEGORY, `/categories/${categoryID}`, "DELETE")(
      {}, {id: categoryID}, accessToken));
  };
