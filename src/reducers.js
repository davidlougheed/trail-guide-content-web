// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import {combineReducers} from "redux";

import assetTypes from "./modules/asset_types/reducer";
import assets from "./modules/assets/reducer";
import categories from "./modules/categories/reducer";
import feedback from "./modules/feedback/reducer";
import modals from "./modules/modals/reducer";
import pages from "./modules/pages/reducer";
import releases from "./modules/releases/reducer";
import sections from "./modules/sections/reducer";
import settings from "./modules/settings/reducer";
import stations from "./modules/stations/reducer";

export default combineReducers({
  assetTypes,
  assets,
  categories,
  feedback,
  modals,
  pages,
  releases,
  sections,
  settings,
  stations,
});
