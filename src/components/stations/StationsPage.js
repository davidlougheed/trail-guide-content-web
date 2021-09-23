import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import StationsListView from "./StationsListView";
import StationsAddView from "./StationsAddView";

const StationsPage = () => {
    return <Switch>
        <Route path="/stations/list"><StationsListView /></Route>
        <Route path="/stations/add"><StationsAddView /></Route>
        <Route path="/stations/detail/:id"><div>aaa</div></Route>
        <Redirect to="/stations/list" />
    </Switch>;
};

export default StationsPage;
