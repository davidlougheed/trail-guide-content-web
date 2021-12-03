// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import ModalListView from "./ModalListView";
import ModalAddView from "./ModalAddView";
import ModalEditView from "./ModalEditView";

const ModalsPage = () => <Switch>
  <Route path="/modals/list"><ModalListView/></Route>
  <Route path="/modals/add"><ModalAddView/></Route>
  <Route path="/modals/edit/:id"><ModalEditView/></Route>
  <Route path="/modals/detail/:id">
    <div>aaa</div>
  </Route>
  <Redirect to="/modals/list"/>
</Switch>;

export default ModalsPage;
