// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import React from "react";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

import {Card, Descriptions, PageHeader} from "antd";
import {FileTextOutlined, PictureOutlined, SoundOutlined, VideoCameraOutlined} from "@ant-design/icons";

import {assetIdToBytesUrl, findItemByID} from "../../utils";

const AssetTypeIcon = ({type}) => {
  switch (type) {
    case "image":
      return <PictureOutlined />;
    case "audio":
      return <SoundOutlined />;
    case "video":
      return <VideoCameraOutlined />;
    case "video_text_track":
      return <FileTextOutlined />;
  }

  return <span/>;
}

const AssetPreview = ({asset}) => {
  if (!asset) return <div/>;

  switch (asset.asset_type) {
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
};

const AssetDetailView = () => {
  const navigate = useNavigate();
  const {id: assetID} = useParams();

  const fetchingAssets = useSelector(state => state.assets.isFetching);
  const asset = useSelector(state => findItemByID(state.assets.items, assetID));

  return <PageHeader
    ghost={false}
    onBack={() => navigate(-1)}
    title={fetchingAssets
      ? "Loading..."
      : <span>Asset: <AssetTypeIcon type={asset?.asset_type}/> {asset?.file_name}</span>}
    // extra={[
    //   <Button key="edit" icon={<EditOutlined/>} onClick={() => navigate(`/assets/edit/${assetID}`)}>
    //     Edit
    //   </Button>,
    // ]}
  >
    <Descriptions bordered={true}>
      <Descriptions.Item label="ID">{asset?.id ?? ""}</Descriptions.Item>
      <Descriptions.Item label="File Name" span={2}>{asset?.file_name ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Type" span={1}>{asset?.asset_type ?? ""}</Descriptions.Item>
      <Descriptions.Item label="File Size" span={1}>
        {((asset?.file_size ?? 0) / 1000).toFixed(0)} KB</Descriptions.Item>
      <Descriptions.Item label="Enabled" span={2}>{asset?.enabled ? "Yes" : "No"}</Descriptions.Item>
      <Descriptions.Item label="SHA1 Checksum" span={3}>{asset?.sha1_checksum ?? ""}</Descriptions.Item>
    </Descriptions>

    <Card size="small" title="Preview" style={{marginTop: 16}}>
      <AssetPreview asset={asset}/>
    </Card>
  </PageHeader>;
};

export default AssetDetailView;
