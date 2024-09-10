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
