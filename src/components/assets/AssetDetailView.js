// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import React from "react";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";

import {Button, Card, Descriptions, PageHeader} from "antd";
import {EditOutlined, FileTextOutlined, PictureOutlined, SoundOutlined, VideoCameraOutlined} from "@ant-design/icons";

import {BASE_URL} from "../../config";
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

    return <span />;
}

const AssetPreview = ({asset}) => {
    if (!asset) return <div />;

    switch (asset.asset_type) {
        case "image":
            return <img src={assetIdToBytesUrl(asset.id)}
                        style={{maxWidth: 800, width: "100%"}}
                        alt={asset.file_name} />;
    }

    return <div />;
};

const AssetDetailView = () => {
    const history = useHistory();
    const {id: assetID} = useParams();

    const fetchingAssets = useSelector(state => state.assets.isFetching);
    const asset = useSelector(state => findItemByID(state.assets.items, assetID));

    return <PageHeader
        ghost={false}
        onBack={() => history.goBack()}
        title={fetchingAssets
            ? "Loading..."
            : <span>Asset: <AssetTypeIcon type={asset?.asset_type} /> {asset?.file_name}</span>}
        extra={[
            <Button key="edit" icon={<EditOutlined />} onClick={() => history.push(`/assets/edit/${assetID}`)}>
                Edit
            </Button>,
        ]}
    >
        <Descriptions bordered={true}>
            <Descriptions.Item label="ID">{asset?.id ?? ""}</Descriptions.Item>
            <Descriptions.Item label="File Name">{asset?.file_name ?? ""}</Descriptions.Item>
            <Descriptions.Item label="Type">{asset?.asset_type ?? ""}</Descriptions.Item>
            <Descriptions.Item label="File Size">
                {((asset?.file_size ?? 0) / 1000).toFixed(0)} KB</Descriptions.Item>
            <Descriptions.Item label="Enabled">{asset?.enabled ? "Yes" : "No"}</Descriptions.Item>
        </Descriptions>

        <Card size="small" title="Preview" style={{marginTop: 16}}>
            <AssetPreview asset={asset} />
        </Card>
    </PageHeader>;
};

export default AssetDetailView;
