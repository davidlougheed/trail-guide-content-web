// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import React from "react";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";

import {Descriptions, PageHeader} from "antd";

import {findItemByID} from "../../utils";

const ReleaseDetailView = () => {
  const history = useHistory();
  const {id: strVersion} = useParams();

  const intVersion = parseInt(strVersion, 10);

  const fetchingReleases = useSelector(state => state.releases.isFetching);
  const release = useSelector(state => findItemByID(state.releases.items, intVersion, "version"));

  const {version, release_notes, bundle_path, submitted_dt, published_dt} = release ?? {};

  return <PageHeader
    ghost={false}
    onBack={() => history.goBack()}
    title={fetchingReleases
      ? "Loading..."
      : <span>Version {release?.version}</span>}
  >
    <Descriptions bordered={true}>
      <Descriptions.Item label="Version">{version ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Submitted">{(new Date(submitted_dt)).toLocaleDateString()}</Descriptions.Item>
      <Descriptions.Item label="Published">
        {published_dt ? (new Date(published_dt)).toLocaleDateString() : "–"}</Descriptions.Item>
      <Descriptions.Item label="Release Notes" span={3}>{release_notes ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Bundle Path">{bundle_path ?? ""}</Descriptions.Item>
    </Descriptions>
  </PageHeader>;
};

export default ReleaseDetailView;
