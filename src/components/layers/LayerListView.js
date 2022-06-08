import React, {useCallback, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {Button, Modal, PageHeader, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

import MapPreview from "./MapPreview";
import {useUrlPagination} from "../../hooks/pages";

const LayerListView = () => {
  const navigate = useNavigate();

  const loadingLayers = useSelector(state => state.layers.isFetching);
  const layers = useSelector(state => state.layers.items);

  const stations = useSelector(state => state.stations.items);

  const [previewShown, setPreviewShown] = useState(false);

  const columns = useMemo(() => [
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
      shouldCellUpdate: (r, pr) => (r?.id !== pr?.id),
      render: layer => <Space size="small">
        <Button icon={<EyeOutlined/>}
                onClick={() => navigate(`/layers/detail/${layer.id}`)}>View</Button>
        <Button icon={<EditOutlined/>}
                onClick={() => navigate(`/layers/edit/${layer.id}`)}>Edit</Button>
        <Button icon={<DeleteOutlined/>} danger={true} disabled={true}>Delete</Button>
      </Space>,
    },
  ], [navigate]);

  const showPreview = useCallback(() => setPreviewShown(true), []);
  const hidePreview = useCallback(() => setPreviewShown(false), []);
  const onAdd = useCallback(() => navigate("/layers/add"), [navigate]);
  const extra = useMemo(() => [
    <Button key="preview" icon={<EyeOutlined />} onClick={showPreview}>Preview Map</Button>,
    <Button key="add"
            type="primary"
            icon={<PlusOutlined/>}
            onClick={onAdd}>
      Add New</Button>,
  ], [showPreview, onAdd]);

  const pagination = useUrlPagination();

  return <PageHeader ghost={false} title="Layers" subTitle="View and edit map layers" extra={extra}>
    <Modal
      title="Map Preview"
      visible={previewShown}
      footer={null}
      onCancel={hidePreview}
      width={800}
    >
      <MapPreview layers={layers} stations={stations} />
    </Modal>
    <Table
      bordered={true}
      loading={loadingLayers}
      columns={columns}
      dataSource={layers}
      rowKey="id"
      pagination={pagination}
    />
  </PageHeader>;
};

export default LayerListView;
