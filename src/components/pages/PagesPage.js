import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import PagesListView from "./PageListView";
import PageEditView from "./PageEditView";
import PageDetailView from "./PageDetailView";

const PagesPage = () => {
  return <Switch>
    <Route path="/pages/list"><PagesListView/></Route>
    <Route path="/pages/edit/:id"><PageEditView/></Route>
    <Route path="/pages/detail/:id"><PageDetailView/></Route>
    <Redirect to="/pages/list"/>
  </Switch>;
};

export default PagesPage;
