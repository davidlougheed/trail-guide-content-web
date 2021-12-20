// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import LayerListView from "./LayerListView";
import LayerAddView from "./LayerAddView";
import LayerEditView from "./LayerEditView";
import LayerDetailView from "./LayerDetailView";

const LayerPage = () => <Switch>
  <Route path="/layers/list"><LayerListView /></Route>
  <Route path="/layers/add"><LayerAddView /></Route>
  <Route path="/layers/edit/:id"><LayerEditView /></Route>
  <Route path="/layers/detail/:id"><LayerDetailView /></Route>
  <Redirect to="/layers/list"/>
</Switch>;

export default LayerPage;
