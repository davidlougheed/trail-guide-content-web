import {useAppSelector} from "../../hooks";
import type {CategoryState} from "./reducer";

export const useCategories = (): CategoryState => {
  return useAppSelector((state) => state.categories);
};
