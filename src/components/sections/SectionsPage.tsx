// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";

import SectionAddView from "./SectionAddView";
import SectionEditView from "./SectionEditView";
import SectionListView from "./SectionListView";

const SectionsPage = React.memo(() => <Routes>
  <Route path="list" element={<SectionListView />} />
  <Route path="add" element={<SectionAddView />} />
  <Route path="edit/:id" element={<SectionEditView />} />
  <Route path="*" element={<Navigate to="list" replace={true} />} />
</Routes>);

export default SectionsPage;
