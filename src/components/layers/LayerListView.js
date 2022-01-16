import React, {useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {Button, Modal, PageHeader, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

import MapPreview from "./MapPreview";

const LayerListView = () => {
  const navigate = useNavigate();

  const loadingLayers = useSelector(state => state.layers.isFetching);
  const layers = useSelector(state => state.layers.items);

  const stations = useSelector(state => state.stations.items);

  const [showPreview, setShowPreview] = useState(false);

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
                onClick={() => navigate(`../detail/${modal.id}`)}>View</Button>
        <Button icon={<EditOutlined/>}
                onClick={() => navigate(`../edit/${modal.id}`)}>Edit</Button>
        <Button icon={<DeleteOutlined/>} danger={true} disabled={true}>Delete</Button>
      </Space>,
    },
  ];

  return <PageHeader
    ghost={false}
    title="Layers"
    subTitle="View and edit map layers"
    extra={[
      <Button key="preview" icon={<EyeOutlined />} onClick={() => setShowPreview(true)}>Preview Map</Button>,
      <Button key="add"
              type="primary"
              icon={<PlusOutlined/>}
              onClick={() => navigate("../add")}>
        Add New</Button>,
    ]}
  >
    <Modal
      title="Map Preview"
      visible={showPreview}
      footer={null}
      onCancel={() => setShowPreview(false)}
      width={800}
    >
      <MapPreview layers={layers} stations={stations} />
    </Modal>
    <Table bordered={true} loading={loadingLayers} columns={columns} dataSource={layers} rowKey="id" />
  </PageHeader>;
};

export default LayerListView;
