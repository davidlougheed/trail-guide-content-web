// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";

import LayerListView from "./LayerListView";
import LayerAddView from "./LayerAddView";
import LayerEditView from "./LayerEditView";
import LayerDetailView from "./LayerDetailView";

const LayerPage = React.memo(() => <Routes>
  <Route path="list" element={<LayerListView />} />
  <Route path="add" element={<LayerAddView />} />
  <Route path="edit/:id" element={<LayerEditView />} />
  <Route path="detail/:id" element={<LayerDetailView />} />
  <Route path="*" element={<Navigate to="list" replace={true} />} />
</Routes>);

export default LayerPage;
