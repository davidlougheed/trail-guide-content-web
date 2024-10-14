import {type GenericNetworkReducerState, makeGenericNetworkReducer} from "../../utils";
import {ADD_CATEGORY, FETCH_CATEGORIES, UPDATE_CATEGORY, DELETE_CATEGORY} from "./actions";
import type {Category} from "./types";

export type CategoryState = GenericNetworkReducerState<Category>;

export default makeGenericNetworkReducer<Category>(FETCH_CATEGORIES, ADD_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY);
