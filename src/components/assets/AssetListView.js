import React from "react";
import {useSelector} from "react-redux";
import {Link, useHistory} from "react-router-dom";

import {Button, PageHeader, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

const AssetListView = () => {
  const history = useHistory();

  const loadingAssets = useSelector(state => state.assets.isFetching);
  const assets = useSelector(state => state.assets.items);

  const columns = [
    {
      title: "File Name",
      dataIndex: "file_name",
      render: (fileName, asset) => <Link to={`/assets/detail/${asset.id}`}>{fileName}</Link>,
    },
    {
      title: "Asset Type",
      dataIndex: "asset_type",
    },
    {
      title: "Size",
      dataIndex: "file_size",
      render: fileSize => <span>{(fileSize / 1000).toFixed(0)} KB</span>,
    },
    {
      title: "Enabled?",
      dataIndex: "enabled",
      render: enabled => enabled ? "Yes" : "No",
    },
    {
      title: "Actions",
      key: "actions",
      render: asset => (
        <Space size="middle">
          <Button icon={<EyeOutlined/>}
                  onClick={() => history.push(`/assets/detail/${asset.id}`)}>View</Button>
          {/*<Button icon={<EditOutlined />}*/}
          {/*        onClick={() => history.push(`/assets/edit/${asset.id}`)}>Edit</Button>*/}
          <Button icon={<DeleteOutlined/>} danger={true} disabled={true}>Delete</Button>
        </Space>
      )
    },
  ];

  return <PageHeader
    ghost={false}
    title="Assets"
    subTitle="View and edit app assets (images, videos, and audio)"
    extra={[
      <Button key="add"
              type="primary"
              icon={<PlusOutlined/>}
              onClick={() => history.push("/assets/add")}>
        Add New</Button>,
    ]}
  >
    <Table bordered={true} loading={loadingAssets} columns={columns} dataSource={assets} rowKey="id"/>
  </PageHeader>;
};

export default AssetListView;
