// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import React from "react";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

import {Button, Card, Descriptions, PageHeader} from "antd";
import {EditOutlined} from "@ant-design/icons";

import ReactJson from "react-json-view";

import {findItemByID} from "../../utils";

const LayerDetailView = () => {
  const navigate = useNavigate();
  const {id: layerID} = useParams();

  const fetchingLayers = useSelector(state => state.layers.isFetching);
  const layer = useSelector(state => findItemByID(state.layers.items, layerID));

  if (!layer) return "Loading...";

  return <PageHeader
    ghost={false}
    onBack={() => navigate(-1)}
    title={fetchingLayers ? "Loading..." : <span>Layer: {layer.name}</span>}
    extra={[
      <Button key="edit" icon={<EditOutlined/>} onClick={() => navigate(`/layers/edit/${layerID}`)}>
        Edit
      </Button>,
    ]}
  >
    <Descriptions bordered={true}>
      <Descriptions.Item label="Name">{layer.name}</Descriptions.Item>
      <Descriptions.Item label="Enabled">{layer?.enabled ? "Yes" : "No"}</Descriptions.Item>
      <Descriptions.Item label="Rank">{layer?.rank ?? "—"}</Descriptions.Item>
    </Descriptions>

    <Card size="small" title="GeoJSON" style={{marginTop: 16}}>
      <ReactJson src={layer?.geojson ?? {}} groupArraysAfterLength={50} />
    </Card>
  </PageHeader>;
};

export default LayerDetailView;
