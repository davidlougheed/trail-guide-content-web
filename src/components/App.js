import React, {useEffect} from "react";
import {connect} from "react-redux";

import {fetchAssetTypesIfNeeded} from "../modules/asset_types/actions";
import {fetchAssetsIfNeeded} from "../modules/assets/actions";
import {fetchCategoriesIfNeeded} from "../modules/categories/actions";
import {fetchModalsIfNeeded} from "../modules/modals/actions";
import {fetchPagesIfNeeded} from "../modules/pages/actions";
import {fetchSectionsIfNeeded} from "../modules/sections/actions";
import {fetchStationsIfNeeded} from "../modules/stations/actions";

const App = (
    {
        fetchAssetTypesIfNeeded,
        fetchAssetsIfNeeded,
        fetchCategoriesIfNeeded,
        fetchModalsIfNeeded,
        fetchPagesIfNeeded,
        fetchSectionsIfNeeded,
        fetchStationsIfNeeded,
    }
) => {
    useEffect(() => {
        fetchAssetTypesIfNeeded();
        fetchAssetsIfNeeded();
        fetchCategoriesIfNeeded();
        fetchModalsIfNeeded();
        fetchPagesIfNeeded();
        fetchSectionsIfNeeded();
        fetchStationsIfNeeded();
    }, []);

    return <div />;
}

export default connect(null, {
    fetchAssetTypesIfNeeded,
    fetchAssetsIfNeeded,
    fetchCategoriesIfNeeded,
    fetchModalsIfNeeded,
    fetchPagesIfNeeded,
    fetchSectionsIfNeeded,
    fetchStationsIfNeeded,
})(App);
