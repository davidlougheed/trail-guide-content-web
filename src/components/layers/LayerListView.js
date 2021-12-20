import React from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

import {Button, PageHeader, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

const LayerListView = () => {
  const history = useHistory();

  const loadingLayers = useSelector(state => state.layers.isFetching);
  const layers = useSelector(state => state.layers.items);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Enabled",
      dataIndex: "enabled",
      render: enabled => enabled ? "Yes" : "No",
    },
    {
      title: "Rank",
      dataIndex: "rank",
    },
    {
      title: "Actions",
      key: "actions",
      render: modal => <Space size="middle">
        <Button icon={<EyeOutlined/>}
                onClick={() => history.push(`/layers/detail/${modal.id}`)}>View</Button>
        <Button icon={<EditOutlined/>}
                onClick={() => history.push(`/layers/edit/${modal.id}`)}>Edit</Button>
        <Button icon={<DeleteOutlined/>} danger={true} disabled={true}>Delete</Button>
      </Space>,
    },
  ];

  return <PageHeader
    ghost={false}
    title="Layers"
    subTitle="View and edit map layers"
    extra={[
      <Button key="add"
              type="primary"
              icon={<PlusOutlined/>}
              onClick={() => history.push("/layers/add")}>
        Add New</Button>,
    ]}
  >
    <Table bordered={true} loading={loadingLayers} columns={columns} dataSource={layers} rowKey="id" />
  </PageHeader>;
};

export default LayerListView;
