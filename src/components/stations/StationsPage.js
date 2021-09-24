import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import StationListView from "./StationListView";
import StationAddView from "./StationAddView";

const StationsPage = () => {
    return <Switch>
        <Route path="/stations/list"><StationListView /></Route>
        <Route path="/stations/add"><StationAddView /></Route>
        <Route path="/stations/detail/:id"><div>aaa</div></Route>
        <Redirect to="/stations/list" />
    </Switch>;
};

export default StationsPage;
