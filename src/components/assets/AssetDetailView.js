// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {Button, Card, Descriptions, PageHeader} from "antd";
import {EditOutlined, FileTextOutlined, PictureOutlined, SoundOutlined, VideoCameraOutlined} from "@ant-design/icons";

import {AUTH_AUDIENCE, BASE_URL} from "../../config";
import {findItemByID} from "../../utils";

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

const AssetPreview = ({asset, ott}) => {
    if (!asset || !ott) return <div />;

    switch (asset.asset_type) {
        case "image":
            return <img src={`${BASE_URL}/assets/${asset.id}/bytes?ott=${ott.token}`}
                        style={{maxWidth: 800, width: "100%"}}
                        alt={asset.file_name} />;
    }

    return <div />;
};

const AssetDetailView = () => {
    const history = useHistory();
    const {id: assetID} = useParams();
    const {isAuthenticated, getAccessTokenSilently} = useAuth0();

    const fetchingAssets = useSelector(state => state.assets.isFetching);
    const asset = useSelector(state => findItemByID(state.assets.items, assetID));

    const [ott, setOtt] = useState();

    useEffect(async () => {
        if (!isAuthenticated) return;

        const accessToken = await getAccessTokenSilently({
            audience: AUTH_AUDIENCE,
            scope: "manage:content",
        });

        const req = await fetch(`${BASE_URL}/ott`, {
            method: "POST",
            headers: {"Authorization": `Bearer ${accessToken}`},
        });

        if (req.ok) {
            const data = await req.json();
            setOtt(data);
        } else {
            console.error("Failed to get OTT", req);
        }
    }, [isAuthenticated]);

    return <PageHeader
        ghost={false}
        onBack={() => history.goBack()}
        title={fetchingAssets
            ? "Loading..."
            : <span><AssetTypeIcon type={asset?.asset_type} /> {asset?.file_name}</span>}
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
            <AssetPreview asset={asset} ott={ott} />
        </Card>
    </PageHeader>;
};

export default AssetDetailView;
