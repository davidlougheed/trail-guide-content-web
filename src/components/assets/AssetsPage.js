import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import AssetAddView from "./AssetAddView";
import AssetListView from "./AssetListView";

const AssetsPage = () => {
    return <Switch>
        <Route path="/assets/list"><AssetListView /></Route>
        <Route path="/assets/add"><AssetAddView /></Route>
        <Route path="/assets/edit/:id"><div>aaa</div></Route>
        <Route path="/assets/detail/:id"><div>aaa</div></Route>
        <Redirect to="/assets/list" />
    </Switch>;
};

export default AssetsPage;
