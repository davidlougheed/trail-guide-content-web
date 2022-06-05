// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import {combineReducers} from "redux";

import assetTypes from "./modules/asset_types/reducer";
import assets from "./modules/assets/reducer";
import categories from "./modules/categories/reducer";
import feedback from "./modules/feedback/reducer";
import layers from "./modules/layers/reducer";
import modals from "./modules/modals/reducer";
import pages from "./modules/pages/reducer";
import releases from "./modules/releases/reducer";
import search from "./modules/search/reducer";
import sections from "./modules/sections/reducer";
import serverConfig from "./modules/server_config/reducer";
import settings from "./modules/settings/reducer";
import stations from "./modules/stations/reducer";

export default combineReducers({
  assetTypes,
  assets,
  categories,
  feedback,
  layers,
  modals,
  pages,
  releases,
  search,
  sections,
  serverConfig,
  settings,
  stations,
});
