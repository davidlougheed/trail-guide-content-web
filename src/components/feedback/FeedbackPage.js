import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import FeedbackDetailView from "./FeedbackDetailView";
import FeedbackListView from "./FeedbackListView";

const FeedbackPage = () => {
    return <Switch>
        <Route path="/feedback/list"><FeedbackListView /></Route>
        <Route path="/feedback/detail/:id"><FeedbackDetailView /></Route>
        <Redirect to="/feedback/list" />
    </Switch>;
};

export default FeedbackPage;
