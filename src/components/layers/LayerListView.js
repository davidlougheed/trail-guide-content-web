import React, {useCallback, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {useAuth0} from "@auth0/auth0-react";

import {Button, Modal, PageHeader, Space, Table} from "antd";
import {CloseSquareOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

import MapPreview from "./MapPreview";

import {useUrlPagination} from "../../hooks/pages";
import {deleteLayer, updateLayer} from "../../modules/layers/actions";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

const LayerListView = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {getAccessTokenSilently} = useAuth0();

  const loadingLayers = useSelector(state => state.layers.isFetching);
  const layers = useSelector(state => state.layers.items);

  const stations = useSelector(state => state.stations.items);

  const [previewShown, setPreviewShown] = useState(false);
  const [delLayer, setDelLayer] = useState(null);

  const columns = useMemo(() => [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Enabled",
      dataIndex: "enabled",
      shouldCellUpdate: (r, pr) => (r?.enabled !== pr?.enabled),
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
        <Button icon={<DeleteOutlined/>} danger={true} onClick={() => setDelLayer(layer)}>Delete</Button>
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

  const closeDelModal = useCallback(() => setDelLayer(null), []);

  const onDisable = useCallback(async () => {
    if (!delLayer) return;
    try {
      const token = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
      await dispatch(updateLayer(delLayer.id, {enabled: false}, token));
    } catch (e) {
      console.error(e);
    }
    closeDelModal();
  }, [dispatch, getAccessTokenSilently, delLayer]);

  const onDelete = useCallback(async () => {
    if (!delLayer) return;
    try {
      const token = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
      await dispatch(deleteLayer(delLayer.id, token));
    } catch (e) {
      console.error(e);
    }
    closeDelModal();
  }, [dispatch, getAccessTokenSilently, delLayer]);

  const pagination = useUrlPagination();

  return <PageHeader ghost={false} title="Layers" subTitle="View and edit map layers" extra={extra}>
    <Modal
      title="Map Preview"
      open={previewShown}
      footer={null}
      onCancel={hidePreview}
      width={800}
    >
      <MapPreview layers={layers} stations={stations} />
    </Modal>

    <Modal title={`Delete layer: ${delLayer?.name}`}
           open={!!delLayer}
           onCancel={closeDelModal}
           footer={<Space>
             <Button type="primary"
                     danger={true}
                     icon={<DeleteOutlined />}
                     onClick={onDelete}>Delete</Button>
             {delLayer?.enabled
               ? <Button type="primary"
                         icon={<CloseSquareOutlined />}
                         onClick={onDisable}>Disable</Button>
               : null}
             <Button onClick={closeDelModal}>Cancel</Button>
           </Space>}>
      Are you sure you wish to delete the layer &ldquo;{delLayer?.name}&rdquo;?&nbsp;
      {delLayer?.enabled ? <span>
        If you wish, you can <a href="#" onClick={onDisable}>disable</a> this layer instead.
      </span> : ""}
    </Modal>

    <Table
      bordered={true}
      size="small"
      loading={loadingLayers}
      columns={columns}
      dataSource={layers}
      rowKey="id"
      pagination={pagination}
    />
  </PageHeader>;
});

export default LayerListView;
