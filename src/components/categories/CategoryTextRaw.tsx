// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React from "react";
import CategoryIcon from "./CategoryIcon";

type CategoryTextRawProps = {
  id: string;
  path: string;
  color: string;
};

const CategoryTextRaw = ({ id, path, color }: CategoryTextRawProps) => (
  <div style={{ display: "flex", gap: "0.4em", alignItems: "center" }}>
    <CategoryIcon path={path} fill={`#${color}`} size={24} />
    <span style={{ flex: 1 }}>{id}</span>
  </div>
);

export default CategoryTextRaw;
