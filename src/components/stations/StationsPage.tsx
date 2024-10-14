// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";

import StationAddView from "./StationAddView";
import StationDetailView from "./StationDetailView";
import StationEditView from "./StationEditView";
import StationListView from "./StationListView";
import StationRevisionView from "./StationRevisionView";

const StationsPage = React.memo(() => <Routes>
  <Route path="list" element={<StationListView />} />
  <Route path="add" element={<StationAddView />} />
  <Route path="detail/:id" element={<StationDetailView />} />
  <Route path="edit/:id" element={<StationEditView />} />
  <Route path="revision/:id" element={<StationRevisionView />} />
  <Route path="*" element={<Navigate to="list" replace={true} />} />
</Routes>);

export default StationsPage;
