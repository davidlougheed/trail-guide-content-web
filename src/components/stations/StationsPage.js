import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";

import StationListView from "./StationListView";
import StationAddView from "./StationAddView";
import StationDetailView from "./StationDetailView";
import StationEditView from "./StationEditView";

const StationsPage = React.memo(() => <Routes>
  <Route path="list" element={<StationListView/>} />
  <Route path="add" element={<StationAddView/>} />
  <Route path="detail/:id" element={<StationDetailView />} />
  <Route path="edit/:id" element={<StationEditView/>} />
  <Route path="*" element={<Navigate to="list" replace={true} />} />
</Routes>);

export default StationsPage;
