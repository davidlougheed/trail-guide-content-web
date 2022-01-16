import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";

import PagesListView from "./PageListView";
import PageEditView from "./PageEditView";
import PageDetailView from "./PageDetailView";

const PagesPage = () => <Routes>
  <Route path="list" element={<PagesListView />} />
  <Route path="edit/:id" element={<PageEditView />} />
  <Route path="detail/:id" element={<PageDetailView />} />
  <Route path="*" element={<Navigate to="list" replace={true} />} />
</Routes>;

export default PagesPage;
