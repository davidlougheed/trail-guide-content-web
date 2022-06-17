import React, {useCallback, useMemo} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {Button, PageHeader, Space, Table} from "antd";
import {DownloadOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import {downloadVersionBundle} from "../../utils";
import {useUrlPagination} from "../../hooks/pages";

const ReleaseListView = React.memo(() => {
  const navigate = useNavigate();

  const {isAuthenticated, getAccessTokenSilently} = useAuth0();

  const loadingReleases = useSelector(state => state.releases.isFetching);
  const releases = useSelector(state => state.releases.items);

  const columns = useMemo(() => [
    {
      title: "Version",
      dataIndex: "version",
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
          <Button
            icon={<DownloadOutlined/>}
            onClick={downloadVersionBundle(release.version, isAuthenticated, getAccessTokenSilently)}
          >Download Bundle</Button>
          <Button icon={<EyeOutlined/>}
                  onClick={() => navigate(`../detail/${release.version}`)}>View</Button>
          {/*<Button icon={<EditOutlined/>}*/}
          {/*        onClick={() => navigate(`edit/${release.version}`)}>Edit</Button>*/}
        </Space>
      )
    },
  ], [isAuthenticated, getAccessTokenSilently, navigate]);

  const onAdd = useCallback(() => navigate("../add"), [navigate]);
  const extra = useMemo(() => [
    <Button key="add"
            type="primary"
            icon={<PlusOutlined/>}
            onClick={onAdd}>
      Add Release
    </Button>
  ], [onAdd]);

  const pagination = useUrlPagination();

  return <PageHeader ghost={false} title="Releases" subTitle="View and create app releases" extra={extra}>
    <Table
      bordered={true}
      size="small"
      loading={loadingReleases}
      columns={columns}
      rowKey="version"
      dataSource={releases}
      pagination={pagination}
    />
  </PageHeader>;
});

export default ReleaseListView;
