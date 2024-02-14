import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";

import ReleaseAddView from "./ReleaseAddView";
import ReleaseListView from "./ReleaseListView";
import ReleaseDetailView from "./ReleaseDetailView";

const ReleasePage = React.memo(() => <Routes>
  <Route path="add" element={<ReleaseAddView />} />
  <Route path="detail/:id" element={<ReleaseDetailView />} />
  <Route path="list" element={<ReleaseListView />} />
  <Route path="*" element={<Navigate to="list" replace={true} />} />
</Routes>);

export default ReleasePage;
