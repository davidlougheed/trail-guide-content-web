import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";

import FeedbackDetailView from "./FeedbackDetailView";
import FeedbackListView from "./FeedbackListView";

const FeedbackPage = () => <Routes>
  <Route path="list" element={<FeedbackListView/>} />
  <Route path="detail/:id" element={<FeedbackDetailView/>} />
  <Route path="*" element={<Navigate to="list" replace={true} />} />
</Routes>;

export default FeedbackPage;
