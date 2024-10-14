// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useMemo} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {Card, Descriptions, PageHeader} from "antd";
import {FileTextOutlined, PictureOutlined, SoundOutlined, VideoCameraOutlined} from "@ant-design/icons";

import {useAppSelector} from "../../hooks";
import {assetIdToBytesUrl, findItemByID} from "../../utils";

import type {AssetType} from "../../modules/asset_types/types";
import type {Asset} from "../../modules/assets/types";

const AssetTypeIcon = React.memo(({type}: {type: AssetType}) => {
  switch (type) {
    case "image":
      return <PictureOutlined />;
    case "audio":
      return <SoundOutlined />;
    case "video":
      return <VideoCameraOutlined />;
    case "video_text_track":
    case "pdf":
      return <FileTextOutlined />;
  }

  return <span/>;
});

const AssetPreview = React.memo(({asset}: {asset: Asset}) => {
  if (!asset) return <div/>;

  switch (asset.asset_type) {
    case "audio":
      return <audio controls={true}>
        <source src={assetIdToBytesUrl(asset.id)} />
      </audio>;
    case "image":
      return <img src={assetIdToBytesUrl(asset.id)}
                  style={{maxWidth: 500, width: "100%"}}
                  alt={asset.file_name}/>;
    case "video":
      return <video width={480} height={270} controls={true}>
        <source src={assetIdToBytesUrl(asset.id)}/>
      </video>;
  }

  return <div/>;
});

const AssetDetailView = React.memo(() => {
  const navigate = useNavigate();
  const {id: assetID} = useParams();

  const assetsInitialFetch = useAppSelector(state => state.assets.initialFetchDone);
  const assetsFetching = useAppSelector(state => state.assets.isFetching);
  const asset = useAppSelector(state => findItemByID<Asset>(state.assets.items, assetID));

  const onBack = useCallback(() => navigate(-1), [navigate]);
  const title = useMemo(
    () => (!assetsInitialFetch && assetsFetching)
      ? "Loading..."
      : <span>Asset: <AssetTypeIcon type={asset?.asset_type}/> {asset?.file_name}</span>,
    [assetsInitialFetch, assetsFetching, asset]);

  return <PageHeader ghost={false} onBack={onBack} title={title}>
    <Descriptions bordered={true} size="small">
      <Descriptions.Item label="ID">
        <span style={{fontFamily: "monospace"}}>{asset?.id ?? ""}</span>
      </Descriptions.Item>
      <Descriptions.Item label="File Name" span={2}>{asset?.file_name ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Type" span={1}>{asset?.asset_type ?? ""}</Descriptions.Item>
      <Descriptions.Item label="File Size" span={3}>
        {((asset?.file_size ?? 0) / 1000).toFixed(0)} KB</Descriptions.Item>
      <Descriptions.Item label="Times used (total)" span={1}>
        {(asset?.times_used_by_all ?? "").toString()}</Descriptions.Item>
      <Descriptions.Item label="Times used (enabled)" span={2}>
        {(asset?.times_used_by_enabled ?? "").toString()}</Descriptions.Item>
      <Descriptions.Item label="SHA1 Checksum" span={3}>
        <span style={{fontFamily: "monospace"}}>{asset?.sha1_checksum ?? ""}</span>
      </Descriptions.Item>
    </Descriptions>

    <Card size="small" title="Preview" style={{marginTop: 16}}>
      <AssetPreview asset={asset} />
    </Card>
  </PageHeader>;
});

export default AssetDetailView;
