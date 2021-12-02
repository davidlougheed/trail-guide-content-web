import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useAuth0} from "@auth0/auth0-react";

import {Alert, AutoComplete, Button, Layout, Input, Menu, Spin, Typography} from "antd";
import {
    CloseSquareOutlined,
    DatabaseOutlined,
    EnvironmentOutlined,
    FileOutlined,
    PictureOutlined,
    SearchOutlined,
    SettingOutlined,
    SolutionOutlined,
} from "@ant-design/icons";

import {Link, Redirect, Route, Switch, useLocation} from "react-router-dom";

import {AUTH_AUDIENCE} from "../config";

import {fetchAssetTypesIfNeeded} from "../modules/asset_types/actions";
import {fetchAssetsIfNeeded} from "../modules/assets/actions";
import {fetchCategoriesIfNeeded} from "../modules/categories/actions";
import {fetchFeedbackIfNeeded} from "../modules/feedback/actions";
import {fetchModalsIfNeeded} from "../modules/modals/actions";
import {fetchPagesIfNeeded} from "../modules/pages/actions";
import {fetchSectionsIfNeeded} from "../modules/sections/actions";
import {fetchSettingsIfNeeded} from "../modules/settings/actions";
import {fetchStationsIfNeeded} from "../modules/stations/actions";

import AssetsPage from "./assets/AssetsPage";
import FeedbackPage from "./feedback/FeedbackPage";
import ModalsPage from "./modals/ModalsPage";
import PagesPage from "./pages/PagesPage";
import SectionsPage from "./sections/SectionsPage";
import StationsPage from "./stations/StationsPage";
import SettingsPage from "./settings/SettingsPage";

const App = () => {
    const {
        loginWithRedirect,
        isLoading: isLoadingAuth,
        isAuthenticated,
        user,
        getAccessTokenSilently,
    } = useAuth0();

    const dispatch = useDispatch();
    useEffect(async () => {
        if (!isAuthenticated) return;

        try {
            const accessToken = await getAccessTokenSilently({
                audience: AUTH_AUDIENCE,
                scope: "read:content",
            });

            [
                fetchAssetTypesIfNeeded,
                fetchAssetsIfNeeded,
                fetchCategoriesIfNeeded,
                fetchFeedbackIfNeeded,
                fetchModalsIfNeeded,
                fetchPagesIfNeeded,
                fetchSectionsIfNeeded,
                fetchSettingsIfNeeded,
                fetchStationsIfNeeded,
            ].map(a => dispatch(a({}, {}, accessToken)));
        } catch (e) {
            console.error(e.message);
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    const location = useLocation();
    const defaultSelectedKeys = [location.pathname.split("/")[1] || "stations"];

    const urlParams = Object.fromEntries(location.search.substr(1).split("&").map(p => {
        const ps = p.split("=");
        return [ps[0], decodeURIComponent(ps[1])];
    }));

    return <Layout style={{height: "100vh"}}>
        <Layout.Header style={{padding: "0 24px"}}>
            <div style={{display: "flex"}}>
                <h1 style={{minWidth: "220px", padding: 0, color: "#DFDFDF", flex: 1}}>
                    Trail Guide Content
                </h1>
                <div style={{flex: 2}}>
                    <AutoComplete style={{marginTop: "12px", width: "100%", float: "right"}}
                                  disabled={!isAuthenticated}>
                        <Input size="large"
                               placeholder="THIS DOESN'T WORK YET"
                               prefix={<SearchOutlined />} />
                    </AutoComplete>
                </div>
                <div style={{flex: 1, color: "white", textAlign: "right"}}>
                    {
                        isLoadingAuth ? "" : (
                            isAuthenticated ? (
                                <span>{user.name}</span>
                            ) : (
                                <a style={{color: "#CCC"}} onClick={() => loginWithRedirect()}>Sign In</a>
                            )
                        )
                    }
                </div>
            </div>
        </Layout.Header>
        <Layout>
            <Layout.Sider collapsedWidth={0} collapsed={!isLoadingAuth && !isAuthenticated}>
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
                    <Menu.Item key="feedback" icon={<SolutionOutlined />}>
                        <Link to="/feedback">Feedback</Link>
                    </Menu.Item>
                    <Menu.Item key="settings" icon={<SettingOutlined />}>
                        <Link to="/settings">Settings</Link>
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
            <Layout.Content style={{overflowY: "auto"}}>
                {isLoadingAuth ? "Loading..." : (isAuthenticated ? (
                <Spin spinning={false}>
                    <Switch>
                        <Route path="/assets"><AssetsPage /></Route>
                        <Route path="/feedback"><FeedbackPage /></Route>
                        <Route path="/modals"><ModalsPage /></Route>
                        <Route path="/pages"><PagesPage /></Route>
                        <Route path="/sections"><SectionsPage /></Route>
                        <Route path="/settings"><SettingsPage /></Route>
                        <Route path="/stations"><StationsPage /></Route>
                        <Redirect to={{pathname: "/stations"}} />
                    </Switch>
                </Spin>
                ) : (
                    <div style={{
                        height: "100%",
                        backgroundColor: "white",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        textAlign: "center",
                    }}>
                        <div style={{paddingBottom: 8}}>
                            <Typography.Text>You must be authenticated to see this content.</Typography.Text>
                        </div>
                        <div>
                            <Button size="large" type="primary" onClick={() => loginWithRedirect()}>Sign In</Button>
                        </div>
                        {urlParams.hasOwnProperty("error_description") ? (
                            <div style={{paddingTop: 16}}>
                                <div style={{maxWidth: 500, padding: "0 16", margin: "0 auto", textAlign: "left"}}>
                                    <Alert message="Authentication Error"
                                           description={urlParams["error_description"]}
                                           type="error" />
                                </div>
                            </div>
                        ) : null}
                    </div>
                ))}
            </Layout.Content>
        </Layout>
    </Layout>;
}

export default App;
