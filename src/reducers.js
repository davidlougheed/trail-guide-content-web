import {combineReducers} from "redux";

import assetTypes from "./modules/asset_types/reducer";
import assets from "./modules/assets/reducer";
import categories from "./modules/categories/reducer";
import modals from "./modules/modals/reducer";
import pages from "./modules/pages/reducer";
import sections from "./modules/sections/reducer";
import stations from "./modules/stations/reducer";

const rootReducer = combineReducers({
    assetTypes,
    assets,
    categories,
    modals,
    pages,
    sections,
    stations,
});

export default rootReducer;
