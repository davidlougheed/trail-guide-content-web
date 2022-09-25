// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useEffect, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useAuth0} from "@auth0/auth0-react";

import {Alert, Button, Layout, Menu, Skeleton, Spin, Typography, PageHeader} from "antd";
import {
  AppstoreOutlined,
  CloseSquareOutlined,
  DatabaseOutlined,
  EnvironmentOutlined,
  FileOutlined,
  GlobalOutlined,
  PictureOutlined,
  SettingOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

import {Link, Navigate, Route, Routes, useLocation} from "react-router-dom";

import pkg from "../../package.json";

import {fetchAssetTypesIfNeeded} from "../modules/asset_types/actions";
import {fetchAssetsIfNeeded} from "../modules/assets/actions";
import {fetchCategoriesIfNeeded} from "../modules/categories/actions";
import {fetchFeedbackIfNeeded} from "../modules/feedback/actions";
import {fetchLayersIfNeeded} from "../modules/layers/actions";
import {fetchModalsIfNeeded} from "../modules/modals/actions";
import {fetchPagesIfNeeded} from "../modules/pages/actions";
import {fetchReleasesIfNeeded} from "../modules/releases/actions";
import {fetchSectionsIfNeeded} from "../modules/sections/actions";
import {fetchSettingsIfNeeded} from "../modules/settings/actions";
import {fetchServerInfoIfNeeded, fetchServerConfigIfNeeded} from "../modules/server/actions";
import {fetchStationsIfNeeded} from "../modules/stations/actions";

import {ACCESS_TOKEN_READ} from "../utils";

import AssetsPage from "./assets/AssetsPage";
import FeedbackPage from "./feedback/FeedbackPage";
import LayerPage from "./layers/LayerPage";
import ModalsPage from "./modals/ModalsPage";
import PagesPage from "./pages/PagesPage";
import ReleasePage from "./releases/ReleasePage";
import SectionsPage from "./sections/SectionsPage";
import StationsPage from "./stations/StationsPage";
import SettingsPage from "./settings/SettingsPage";
import SearchBar from "./SearchBar";

const OBJECT_TYPES = [
  {
    key: "stations",
    label: <Link to="/stations">Stations</Link>,
    icon: <EnvironmentOutlined />,
    fetchAll: fetchStationsIfNeeded,
  },
  {
    key: "sections",
    label: <Link to="/sections">Sections</Link>,
    icon: <DatabaseOutlined />,
    fetchAll: fetchSectionsIfNeeded,
  },
  {
    key: "pages",
    label: <Link to="/pages">Pages</Link>,
    icon: <FileOutlined />,
    fetchAll: fetchPagesIfNeeded,
  },
  {
    key: "modals",
    label: <Link to="/modals">Modals</Link>,
    icon: <CloseSquareOutlined />,
    fetchAll: fetchModalsIfNeeded,
  },
  {
    key: "assets",
    label: <Link to="/assets">Assets</Link>,
    icon: <PictureOutlined />,
    fetchAll: fetchAssetsIfNeeded,
  },
  {
    key: "layers",
    label: <Link to="/layers">Layers</Link>,
    icon: <GlobalOutlined />,
    fetchAll: fetchLayersIfNeeded,
  },
  {
    key: "releases",
    label: <Link to="/releases">Releases</Link>,
    icon: <AppstoreOutlined />,
    fetchAll: fetchReleasesIfNeeded,
  },
  {
    key: "feedback",
    label: <Link to="/feedback">Feedback</Link>,
    icon: <SolutionOutlined />,
    fetchAll: fetchFeedbackIfNeeded,
  },
  {
    key: "settings",
    label: <Link to="/settings">Settings</Link>,
    icon: <SettingOutlined />,
    fetchAll: fetchSettingsIfNeeded,
  },

  {
    key: "assetTypes",
    fetchAll: fetchAssetTypesIfNeeded,
  },
  {
    key: "categories",
    fetchAll: fetchCategoriesIfNeeded,
  },
]
const MENU_ITEMS = OBJECT_TYPES.filter(t => t.label).map(t => ({key: t.key, label: t.label, icon: t.icon}));

const styles = {
  layout: {height: "100vh"},
  header: {padding: "0 24px"},
  headerInner: {display: "flex"},
  headerText: {minWidth: "220px", padding: 0, color: "#DFDFDF", flex: 1},
  searchContainer: {flex: 2},
  authContainer: {flex: 1, color: "white", textAlign: "right"},
  signInLink: {color: "#CCC"},

  sider: {overflowY: "auto"},
  versionContainer: {
    color: "rgba(255, 255, 255, 0.4)",
    padding: "8px 16px",
    display: "flex",
    flexDirection: "column",
    fontFamily: "monospace",
    fontSize: 12,
  },

  content: {overflowY: "auto"},

  signedOut: {
    height: "100%",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
  signedOutText: {paddingBottom: 8},
  signedOutAlertOuter: {paddingTop: 16},
  signedOutAlertInner: {maxWidth: 500, padding: "0 16", margin: "0 auto", textAlign: "left"},
};

const PageHeaderSubtitleSkeleton = React.memo(() =>
  <Skeleton title={false} paragraph={{rows: 1, width: 200}} style={{marginTop: 12}} />
);

const App = React.memo(() => {
  const {
    loginWithRedirect,
    isLoading: isLoadingAuth,
    isAuthenticated,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  const dispatch = useDispatch();
  const location = useLocation();

  const updateObjects = useCallback((isInitial) => {
    if (!isAuthenticated) return;
    // TODO: Don't update if not initial and on an edit page
    const asyncWrapper = async () => {
      const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_READ);
      const typesToUpdate = OBJECT_TYPES
        .filter(t => isInitial || !t.label || (t.label && !location.pathname.startsWith(`/${t.key}/edit`)));
      // TODO: Alert if we've actually changed something and we're on a detail page
      return await Promise.all(typesToUpdate.map(t => dispatch(t.fetchAll({}, {}, accessToken))));
    };
    return asyncWrapper();
  }, [isAuthenticated, getAccessTokenSilently, location.pathname])

  useEffect(() => {
    const initialFetch = async () => {
      if (!isAuthenticated) return;

      try {
        await dispatch(fetchServerInfoIfNeeded());
        await dispatch(fetchServerConfigIfNeeded());
        await updateObjects(true);
      } catch (e) {
        console.error(e.message);
      }
    };

    initialFetch().catch(e => console.error(e.message));

    // Set 20-second update interval to fetch changes to other objects
    const interval = setInterval(() => updateObjects(false), 20000);
    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated, updateObjects]);

  const selectedKeys = useMemo(() => [location.pathname.split("/")[1] || "stations"], [location]);

  const urlParams = useMemo(() => Object.fromEntries(location.search.slice(1).split("&").map(p => {
    const ps = p.split("=");
    return [ps[0], decodeURIComponent(ps[1])];
  })), [location]);

  const loadingServerInfo = useSelector(state => state.server.info.isFetching);
  const serverInfo = useSelector(state => state.server.info.data);

  const loadingConfig = useSelector(state => state.server.config.isFetching);
  const serverConfig = useSelector(state => state.server.config.data);

  const siteTitle = useMemo(
    () => (loadingConfig || serverConfig === null) ? "" : (serverConfig?.APP_NAME || "Trail Guide"),
    [loadingConfig, serverConfig]);
  document.title = siteTitle || "Trail Guide";

  const signIn = useCallback(() => loginWithRedirect(), [loginWithRedirect]);

  // noinspection JSValidateTypes
  return <Layout style={styles.layout}>
    <Layout.Header style={styles.header}>
      <div style={styles.headerInner}>
        <h1 style={styles.headerText}>{siteTitle}</h1>
        <div style={styles.searchContainer}><SearchBar /></div>
        <div style={styles.authContainer}>
          {isLoadingAuth ? "" : (
            isAuthenticated
              ? <span>{user.name}</span>
              : <a style={styles.signInLink} onClick={signIn}>Sign In</a>
          )}
        </div>
      </div>
    </Layout.Header>
    <Layout>
      <Layout.Sider style={styles.sider}
                    collapsedWidth={0}
                    collapsed={!isAuthenticated || (isAuthenticated && isLoadingAuth)}>
        <Menu theme="dark" selectedKeys={selectedKeys} items={MENU_ITEMS} />
        <div style={styles.versionContainer}>
          <span>Web v{pkg.version}</span>
          <span>Server {!loadingServerInfo && serverInfo?.version ? (<span>v{serverInfo?.version}</span>) : null}</span>
        </div>
      </Layout.Sider>
      <Layout.Content style={styles.content}>
        {isLoadingAuth
          ? (
            <PageHeader
              ghost={false}
              title="Loading..."
              subTitle={<PageHeaderSubtitleSkeleton />}
            />
          ) : (isAuthenticated ? (
            <Spin spinning={false}>
              <Routes>
                <Route path="/assets/*" element={<AssetsPage />} />
                <Route path="/feedback/*" element={<FeedbackPage />} />
                <Route path="/layers/*" element={<LayerPage />} />
                <Route path="/modals/*" element={<ModalsPage />} />
                <Route path="/pages/*" element={<PagesPage />} />
                <Route path="/releases/*" element={<ReleasePage />} />
                <Route path="/sections/*" element={<SectionsPage />} />
                <Route path="/settings/*" element={<SettingsPage />} />
                <Route path="/stations/*" element={<StationsPage />} />
                <Route path="/" element={<Navigate to="/stations" replace={true} />} />
              </Routes>
            </Spin>
          ) : (
            <div style={styles.signedOut}>
              <div style={styles.signedOutText}>
                <Typography.Text>You must be authenticated to see this content.</Typography.Text>
              </div>
              <div>
                <Button size="large" type="primary" onClick={signIn}>Sign In</Button>
              </div>
              {urlParams.hasOwnProperty("error_description") ? (
                <div style={styles.signedOutAlertOuter}>
                  <div style={styles.signedOutAlertInner}>
                    <Alert message="Authentication Error" description={urlParams["error_description"]} type="error"/>
                  </div>
                </div>
              ) : null}
            </div>
        ))}
      </Layout.Content>
    </Layout>
  </Layout>;
});

export default App;
