// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";

import CategoryAddView from "./CategoryAddView";
import CategoryEditView from "./CategoryEditView";
import CategoryListView from "./CategoryListView";

const CategoriesPage = React.memo(() => <Routes>
  <Route path="list" element={<CategoryListView />} />
  <Route path="add" element={<CategoryAddView />} />
  <Route path="edit/:id" element={<CategoryEditView />} />
  <Route path="*" element={<Navigate to="list" replace={true} />} />
</Routes>);

export default CategoriesPage;
