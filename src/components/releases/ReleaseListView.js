import React from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

import {Button, PageHeader, Space, Table} from "antd";
import {DownloadOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

const ReleaseListView = () => {
  const history = useHistory();

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
      render: releaseNotes => {
        if (releaseNotes.length < 100) return releaseNotes;
        else return releaseNotes.substr(0, 97) + "...";
      },
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
        <Space size="middle">
          <Button icon={<DownloadOutlined/>} disabled={true} onClick={() => {}}>Download Bundle</Button>
          <Button icon={<EyeOutlined/>}
                  onClick={() => history.push(`/releases/detail/${release.version}`)}>View</Button>
          {/*<Button icon={<EditOutlined/>}*/}
          {/*        onClick={() => history.push(`/releases/edit/${release.version}`)}>Edit</Button>*/}
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
              onClick={() => history.push("/releases/add")}>
        Add Release
      </Button>
    ]}
  >
    <Table bordered={true} loading={loadingReleases} columns={columns} rowKey="version" dataSource={releases} />
  </PageHeader>;
};

export default ReleaseListView;
