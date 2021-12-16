import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import ReleaseAddView from "./ReleaseAddView";
import ReleaseListView from "./ReleaseListView";
import ReleaseDetailView from "./ReleaseDetailView";

const ReleasePage = () => {
  return <Switch>
    <Route path="/releases/add"><ReleaseAddView /></Route>
    <Route path="/releases/detail/:id"><ReleaseDetailView /></Route>
    <Route path="/releases/list"><ReleaseListView /></Route>
    <Redirect to="/releases/list" />
  </Switch>;
};

export default ReleasePage;
