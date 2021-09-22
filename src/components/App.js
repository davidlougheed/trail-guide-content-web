import React, {useEffect} from "react";
import {connect} from "react-redux";

import {AutoComplete, Layout, Input, Spin} from "antd";
import {SearchOutlined} from "@ant-design/icons";

import {fetchAssetTypesIfNeeded} from "../modules/asset_types/actions";
import {fetchAssetsIfNeeded} from "../modules/assets/actions";
import {fetchCategoriesIfNeeded} from "../modules/categories/actions";
import {fetchModalsIfNeeded} from "../modules/modals/actions";
import {fetchPagesIfNeeded} from "../modules/pages/actions";
import {fetchSectionsIfNeeded} from "../modules/sections/actions";
import {fetchSettingsIfNeeded} from "../modules/settings/actions";
import {fetchStationsIfNeeded} from "../modules/stations/actions";

const App = (
    {
        fetchAssetTypesIfNeeded,
        fetchAssetsIfNeeded,
        fetchCategoriesIfNeeded,
        fetchModalsIfNeeded,
        fetchPagesIfNeeded,
        fetchSectionsIfNeeded,
        fetchSettingsIfNeeded,
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
        fetchSettingsIfNeeded();
        fetchStationsIfNeeded();
    }, []);

    return <Layout>
        <Layout.Header style={{padding: "0 24px", height: "100%"}}>
            <div style={{display: "flex"}}>
                <h1 style={{margin: "0 24px 0 0", padding: 0, color: "#DFDFDF"}}>
                    Trail Guide Content
                </h1>
                <div style={{flex: 1}}>
                    <AutoComplete style={{marginTop: "12px", width: "100%", maxWidth: "800px", float: "right"}}>
                        <Input size="large"
                               placeholder="THIS DOESN'T WORK YET"
                               prefix={<SearchOutlined />} />
                    </AutoComplete>
                </div>
            </div>
        </Layout.Header>
        <Layout.Content>
            {/*{authError ? <Alert type="error" showIcon message="Authentication Error" description={authError} /> : null}*/}
            {/*{metaError ? <Alert type="error" showIcon message="Site Metadata Error" description={metaError} /> : null}*/}
            {/*{searchError ? <Alert type="error" showIcon message="Search Error" description={searchError} /> : null}*/}
            <Spin spinning={false}>
                {/*<Switch>*/}
                {/*    <Route path="/sign-in" exact><SignInView /></Route>*/}
                {/*    <PrivateRoute path="/relations"><RelationsView /></PrivateRoute>*/}
                {/*    <Redirect to={{pathname: "/relations"}} />*/}
                {/*</Switch>*/}
            </Spin>
        </Layout.Content>
    </Layout>;
}

export default connect(null, {
    fetchAssetTypesIfNeeded,
    fetchAssetsIfNeeded,
    fetchCategoriesIfNeeded,
    fetchModalsIfNeeded,
    fetchPagesIfNeeded,
    fetchSectionsIfNeeded,
    fetchSettingsIfNeeded,
    fetchStationsIfNeeded,
})(App);
