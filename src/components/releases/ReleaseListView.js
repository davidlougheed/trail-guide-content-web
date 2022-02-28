import React from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {Button, PageHeader, Space, Table} from "antd";
import {DownloadOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import {downloadVersionBundle} from "../../utils";

const ReleaseListView = () => {
  const navigate = useNavigate();

  const {isAuthenticated, getAccessTokenSilently} = useAuth0();

  const loadingReleases = useSelector(state => state.releases.isFetching);
  const releases = useSelector(state => state.releases.items);

  const columns = [
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
  ];

  return <PageHeader
    ghost={false}
    title="Releases"
    subTitle="View and create app releases"
    extra={[
      <Button key="add"
              type="primary"
              icon={<PlusOutlined/>}
              onClick={() => navigate("../add")}>
        Add Release
      </Button>
    ]}
  >
    <Table bordered={true} loading={loadingReleases} columns={columns} rowKey="version" dataSource={releases} />
  </PageHeader>;
};

export default ReleaseListView;
