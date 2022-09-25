// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useMemo} from "react";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

import {Descriptions, PageHeader} from "antd";

import {downloadVersionBundle, findItemByID} from "../../utils";
import {useAuth0} from "@auth0/auth0-react";

const styles = {
  nowrap: {whiteSpace: "nowrap"},
};

const ReleaseDetailView = React.memo(() => {
  const navigate = useNavigate();
  const {id: strVersion} = useParams();

  const {isAuthenticated, getAccessTokenSilently} = useAuth0();

  const intVersion = parseInt(strVersion, 10);

  const releasesInitialFetch = useSelector(state => state.releases.initialFetchDone);
  const releasesFetching = useSelector(state => state.releases.isFetching);
  const release = useSelector(state => findItemByID(state.releases.items, intVersion, "version"));

  const {version, release_notes, bundle_path, bundle_size, submitted_dt, published_dt} = release ?? {};

  const onBack = useCallback(() => navigate(-1), [navigate]);

  const title = useMemo(
    () => (!releasesInitialFetch && releasesFetching) ? "Loading..." : <span>Version {release?.version}</span>,
    [releasesInitialFetch, releasesFetching, release])

  return <PageHeader ghost={false} onBack={onBack} title={title}>
    <Descriptions bordered={true} size="small">
      <Descriptions.Item label="Version">{version ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Submitted">
        <span style={styles.nowrap}>{(new Date(submitted_dt)).toLocaleDateString()}</span></Descriptions.Item>
      <Descriptions.Item label="Published">
        <span style={styles.nowrap}>{published_dt ? (new Date(published_dt)).toLocaleDateString() : "–"}</span>
      </Descriptions.Item>
      <Descriptions.Item label="Release Notes" span={3}>{release_notes ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Bundle Path">
        <a onClick={downloadVersionBundle(version, isAuthenticated, getAccessTokenSilently)}>{bundle_path ?? ""}</a>
      </Descriptions.Item>
      <Descriptions.Item label="Bundle Size">
        <span style={styles.nowrap}>{bundle_size ? `${(bundle_size / 1000000).toFixed(1)} MB` : "—"}</span>
      </Descriptions.Item>
    </Descriptions>
  </PageHeader>;
});

export default ReleaseDetailView;
