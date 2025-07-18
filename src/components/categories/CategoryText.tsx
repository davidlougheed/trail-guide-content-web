// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React from "react";
import {useCategories} from "../../modules/categories/hooks";
import CategoryTextRaw from "./CategoryTextRaw";

type CategoryTextProps = {
  id: string;
  color?: string;
}

const CategoryText = ({id, color}: CategoryTextProps) => {
  const {itemsByID: categories} = useCategories();
  const category = categories[id];
  if (!category) return <strong>CATEGORY NOT FOUND</strong>;
  return <CategoryTextRaw id={id} path={category.icon_svg} color={color ?? "000000"} />;
};

export default CategoryText;
