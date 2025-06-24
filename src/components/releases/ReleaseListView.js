import React, {useCallback, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {Button, PageHeader, Space, Table} from "antd";
import {DownloadOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

import {API_BASE_URL, AUTH_AUDIENCE} from "../../config";
import {useUrlPagination} from "../../hooks/pages";
import {downloadVersionBundle, makeAuthHeaders} from "../../utils";

const ReleaseListView = React.memo(() => {
  const navigate = useNavigate();

  const {isAuthenticated, getAccessTokenSilently} = useAuth0();

  const releasesInitialFetch = useSelector(state => state.releases.initialFetchDone);
  const releasesFetching = useSelector(state => state.releases.isFetching);
  const releases = useSelector(state => state.releases.items);

  const [bundleLoading, setBundleLoading] = useState(false);

  // noinspection JSUnusedGlobalSymbols
  const columns = useMemo(() => [
    {
      title: "Version",
      dataIndex: "version",
      sorter: (a, b) => a.version - b.version,
      defaultSortOrder: "descend",
    },
    {
      title: "Release Notes",
      dataIndex: "release_notes",
      render: releaseNotes =>
        releaseNotes.length < 100
          ? releaseNotes
          : `${releaseNotes.slice(0, 98)}...`,
    },
    {
      title: "Submitted",
      dataIndex: "submitted_dt",
      render: s => (new Date(s)).toLocaleDateString(),
    },
    {
      title: "Published",
      dataIndex: "published_dt",
      render: s => s ? (new Date(s)).toLocaleDateString() : "—",
    },
    {
      title: "Actions",
      key: "actions",
      render: release => (
        <Space size="small">
          <Button icon={<DownloadOutlined/>}
                  onClick={downloadVersionBundle(release.version, isAuthenticated, getAccessTokenSilently)}>
            Download Bundle{release.bundle_size
              ? ` (${(release.bundle_size / 1000000).toFixed(1)} MB)`
              : ""}
          </Button>
          <Button icon={<EyeOutlined/>}
                  onClick={() => navigate(`../detail/${release.version}`)}>View</Button>
          {/*<Button icon={<EditOutlined/>}*/}
          {/*        onClick={() => navigate(`edit/${release.version}`)}>Edit</Button>*/}
        </Space>
      )
    },
  ], [isAuthenticated, getAccessTokenSilently, navigate]);

  const onBundle = useCallback(() => {
    (async () => {
      if (!isAuthenticated) return;

      setBundleLoading(true);

      try {
        const accessToken = await getAccessTokenSilently({
          audience: AUTH_AUDIENCE,
          scope: "read:content",
        });

        const res = await fetch(`${API_BASE_URL}/ad-hoc-bundle`, { headers: makeAuthHeaders(accessToken) });
        if (res.ok) {
          const blob = await res.blob();
          const bundleBlobUrl = window.URL.createObjectURL(blob);
          window.location.href = bundleBlobUrl;
          window.URL.revokeObjectURL(bundleBlobUrl);
        }
      } finally {
        setBundleLoading(false);
      }
    })();
  }, [navigate, getAccessTokenSilently]);

  const onAdd = useCallback(() => navigate("../add"), [navigate]);
  const extra = useMemo(() => [
    <Button key="bundle" icon={<DownloadOutlined />} onClick={onBundle} loading={bundleLoading}>
      Download Ad Hoc Bundle
    </Button>,
    <Button key="add" type="primary" icon={<PlusOutlined />} onClick={onAdd}>Add Release</Button>
  ], [onAdd]);

  const pagination = useUrlPagination();

  return <PageHeader ghost={false} title="Releases" subTitle="View and create app releases" extra={extra}>
    <Table
      bordered={true}
      size="small"
      loading={!releasesInitialFetch && releasesFetching}
      columns={columns}
      rowKey="version"
      dataSource={releases}
      pagination={pagination}
    />
  </PageHeader>;
});

export default ReleaseListView;
