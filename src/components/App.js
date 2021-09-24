import React, {useEffect} from "react";
import {connect} from "react-redux";

import {AutoComplete, Layout, Input, Menu, Spin} from "antd";
import {
    CloseSquareOutlined,
    DatabaseOutlined,
    EnvironmentOutlined,
    FileOutlined,
    PictureOutlined,
    SearchOutlined,
    SettingOutlined,
} from "@ant-design/icons";

import {Link, Redirect, Route, Switch, useLocation} from "react-router-dom";

import {fetchAssetTypesIfNeeded} from "../modules/asset_types/actions";
import {fetchAssetsIfNeeded} from "../modules/assets/actions";
import {fetchCategoriesIfNeeded} from "../modules/categories/actions";
import {fetchModalsIfNeeded} from "../modules/modals/actions";
import {fetchPagesIfNeeded} from "../modules/pages/actions";
import {fetchSectionsIfNeeded} from "../modules/sections/actions";
import {fetchSettingsIfNeeded} from "../modules/settings/actions";
import {fetchStationsIfNeeded} from "../modules/stations/actions";

import AssetsPage from "./assets/AssetsPage";
import ModalsPage from "./ModalsPage";
import PagesPage from "./pages/PagesPage";
import SectionsPage from "./SectionsPage";
import StationsPage from "./stations/StationsPage";
import SettingsPage from "./SettingsPage";

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

    const location = useLocation();
    const defaultSelectedKeys = [location.pathname.split("/")[1] || "stations"];

    return <Layout style={{height: "100vh"}}>
        <Layout.Header style={{padding: "0 24px"}}>
            <div style={{display: "flex"}}>
                <h1 style={{minWidth: "220px", padding: 0, color: "#DFDFDF", flex: 1}}>
                    Trail Guide Content
                </h1>
                <div style={{flex: 2}}>
                    <AutoComplete style={{marginTop: "12px", width: "100%", float: "right"}}>
                        <Input size="large"
                               placeholder="THIS DOESN'T WORK YET"
                               prefix={<SearchOutlined />} />
                    </AutoComplete>
                </div>
                <div style={{flex: 1, color: "white", textAlign: "right"}}>David</div>
            </div>
        </Layout.Header>
        <Layout>
            <Layout.Sider>
                <Menu theme="dark" defaultSelectedKeys={defaultSelectedKeys}>
                    <Menu.Item key="stations" icon={<EnvironmentOutlined />}>
                        <Link to="/stations">Stations</Link>
                    </Menu.Item>
                    <Menu.Item key="sections" icon={<DatabaseOutlined />}>
                        <Link to="/sections">Sections</Link>
                    </Menu.Item>
                    <Menu.Item key="pages" icon={<FileOutlined />}>
                        <Link to="/pages">Pages</Link>
                    </Menu.Item>
                    <Menu.Item key="modals" icon={<CloseSquareOutlined />}>
                        <Link to="/modals">Modals</Link>
                    </Menu.Item>
                    <Menu.Item key="assets" icon={<PictureOutlined />}>
                        <Link to="/assets">Assets</Link>
                    </Menu.Item>
                    <Menu.Item key="settings" icon={<SettingOutlined />}>
                        <Link to="/settings">Settings</Link>
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
            <Layout.Content style={{overflowY: "auto"}}>
                <Spin spinning={false}>
                    <Switch>
                        <Route path="/assets"><AssetsPage /></Route>
                        <Route path="/modals"><ModalsPage /></Route>
                        <Route path="/pages"><PagesPage /></Route>
                        <Route path="/sections"><SectionsPage /></Route>
                        <Route path="/settings"><SettingsPage /></Route>
                        <Route path="/stations"><StationsPage /></Route>
                        <Redirect to={{pathname: "/stations"}} />
                    </Switch>
                </Spin>
            </Layout.Content>
        </Layout>
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
