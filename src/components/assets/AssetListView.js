import React from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

import {Button, PageHeader, Space, Table} from "antd";
import {EditOutlined, PlusOutlined} from "@ant-design/icons";

const AssetListView = () => {
    const history = useHistory();

    const loadingAssets = useSelector(state => state.assets.isFetching);
    const assets = useSelector(state => state.assets.items);

    const columns = [
        {
            title: "File Name",
            dataIndex: "file_name",
        },
        {
            title: "Asset Type",
            dataIndex: "asset_type",
        },
        {
            title: "Size",
            dataIndex: "file_size",
            // TODO: Nice render
        },
        {
            title: "Actions",
            key: "actions",
            render: page => (
                <Space size="middle">
                    <Button icon={<EditOutlined />}
                            onClick={() => history.push(`/assets/edit/${page.id}`)}>Edit</Button>
                </Space>
            )
        },
    ];

    return <PageHeader
        ghost={false}
        title="Assets"
        subTitle="View and edit app assets (images, videos, and audio)"
        extra={[
            <Button key="add"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => history.push("/assets/add")}>
                Add New</Button>,
        ]}
    >
        <Table bordered={true} loading={loadingAssets} columns={columns} dataSource={assets} rowKey="id" />
    </PageHeader>;
};

export default AssetListView;
