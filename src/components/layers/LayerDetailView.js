// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

import {Button, Card, Descriptions, Modal, PageHeader} from "antd";
import {EditOutlined, EyeOutlined} from "@ant-design/icons";

import ReactJson from "react-json-view";

import {findItemByID} from "../../utils";
import MapPreview from "./MapPreview";

const LayerDetailView = () => {
  const navigate = useNavigate();
  const {id: layerID} = useParams();

  const [previewShown, setPreviewShown] = useState(false);

  const fetchingLayers = useSelector(state => state.layers.isFetching);
  const layer = useSelector(state => findItemByID(state.layers.items, layerID));

  if (!layer) return "Loading...";

  const onBack = useCallback(() => navigate(-1), [navigate]);
  const showPreview = useCallback(() => setPreviewShown(true), []);
  const hidePreview = useCallback(() => setPreviewShown(false), []);
  const editLayer = useCallback(() => navigate(`/layers/edit/${layerID}`), [navigate, layerID]);

  return <PageHeader
    ghost={false}
    onBack={onBack}
    title={fetchingLayers ? "Loading..." : <span>Layer: {layer.name}</span>}
    extra={[
      <Button key="preview" icon={<EyeOutlined />} onClick={showPreview}>Preview Layer</Button>,
      <Button key="edit" icon={<EditOutlined/>} onClick={editLayer}>Edit</Button>,
    ]}
  >
    <Descriptions bordered={true} size="small">
      <Descriptions.Item label="Name">{layer.name}</Descriptions.Item>
      <Descriptions.Item label="Enabled">{layer?.enabled ? "Yes" : "No"}</Descriptions.Item>
      <Descriptions.Item label="Rank">{layer?.rank ?? "—"}</Descriptions.Item>
    </Descriptions>

    <Card size="small" title="GeoJSON" style={{marginTop: 16}}>
      <ReactJson src={layer?.geojson ?? {}} groupArraysAfterLength={50} />
    </Card>

    <Modal
      title="Layer Preview"
      visible={previewShown}
      footer={null}
      onCancel={hidePreview}
      width={800}
    >
      <MapPreview layers={[layer]} />
    </Modal>
  </PageHeader>;
};

export default LayerDetailView;
