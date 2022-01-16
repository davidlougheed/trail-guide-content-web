import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";

import AssetAddView from "./AssetAddView";
import AssetListView from "./AssetListView";
import AssetDetailView from "./AssetDetailView";

const AssetsPage = () => <Routes>
  <Route path="list" element={<AssetListView/>} />
  <Route path="add" element={<AssetAddView/>} />
  {/*<Route path="/assets/edit/:id"><div>aaa</div></Route>*/}
  <Route path="detail/:id" element={<AssetDetailView/>} />
  <Route path="*" element={<Navigate to="list" replace={true} />} />
</Routes>;

export default AssetsPage;
