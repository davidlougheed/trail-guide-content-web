// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

import {Button, Card, Descriptions, Modal, PageHeader} from "antd";
import {EditOutlined, EyeOutlined} from "@ant-design/icons";

import ReactJson from "react-json-view";

import {findItemByID} from "../../utils";
import MapPreview from "./MapPreview";

const styles = {
  jsonCard: {marginTop: 16},
};

const LayerDetailView = React.memo(() => {
  const navigate = useNavigate();
  const {id: layerID} = useParams();

  const [previewShown, setPreviewShown] = useState(false);

  const fetchingLayers = useSelector(state => state.layers.isFetching);
  const layer = useSelector(state => findItemByID(state.layers.items, layerID));
  const layerArr = useMemo(() => [layer], [layer]);
  const geoJSON = useMemo(() => layer?.geojson ?? {}, [layer]);

  const onBack = useCallback(() => navigate(-1), [navigate]);
  const showPreview = useCallback(() => setPreviewShown(true), []);
  const hidePreview = useCallback(() => setPreviewShown(false), []);
  const editLayer = useCallback(() => navigate(`/layers/edit/${layerID}`), [navigate, layerID]);

  const title = useMemo(
    () => fetchingLayers ? "Loading..." : <span>Layer: {layer.name}</span>,
    [fetchingLayers, layer])
  const extra = useMemo(() => [
    <Button key="preview" icon={<EyeOutlined />} onClick={showPreview}>Preview Layer</Button>,
    <Button key="edit" icon={<EditOutlined/>} onClick={editLayer}>Edit</Button>,
  ], [showPreview, editLayer]);

  return <PageHeader ghost={false} onBack={onBack} title={title} extra={extra}>
    <Descriptions bordered={true} size="small">
      <Descriptions.Item label="Name">{layer?.name ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Enabled">{layer?.enabled ? "Yes" : "No"}</Descriptions.Item>
      <Descriptions.Item label="Rank">{layer?.rank ?? "—"}</Descriptions.Item>
    </Descriptions>

    <Card size="small" title="GeoJSON" style={styles.jsonCard}>
      <ReactJson src={geoJSON} groupArraysAfterLength={50} />
    </Card>

    <Modal
      title="Layer Preview"
      visible={previewShown}
      footer={null}
      onCancel={hidePreview}
      width={800}
    >
      <MapPreview layers={layerArr} />
    </Modal>
  </PageHeader>;
});

export default LayerDetailView;
