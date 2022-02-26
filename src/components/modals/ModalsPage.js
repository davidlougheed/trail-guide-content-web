// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";

import ModalListView from "./ModalListView";
import ModalAddView from "./ModalAddView";
import ModalEditView from "./ModalEditView";

const ModalsPage = () => <Routes>
  <Route path="list" element={<ModalListView />} />
  <Route path="add" element={<ModalAddView />} />
  <Route path="edit/:id" element={<ModalEditView />} />
  <Route path="detail/:id" element={<div>aaa</div>} />
  <Route path="*" element={<Navigate to="list" replace={true} />} />
</Routes>;

export default ModalsPage;
