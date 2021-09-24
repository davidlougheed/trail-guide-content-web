import React from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

import {Button, PageHeader, Space, Table} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

const COLUMNS = [
    {
        title: "Title",
        dataIndex: "title",
    },
    {
        title: "Enabled",
        dataIndex: "enabled",
        render: v => v ? (<CheckOutlined />) : (<CloseOutlined />),
    },
    {
        title: "Actions",
        key: "actions",
        render: () => (
            <Space size="middle">
                <Button>Edit</Button>
            </Space>
        )
    },
];

const PageListView = () => {
    const history = useHistory();

    const loadingPages = useSelector(state => state.pages.isFetching);
    const pages = useSelector(state => state.pages.items);

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
        },
        {
            title: "Enabled",
            dataIndex: "enabled",
            render: v => v ? (<CheckOutlined />) : (<CloseOutlined />),
        },
        {
            title: "Actions",
            key: "actions",
            render: page => (
                <Space size="middle">
                    <Button onClick={() => history.push(`/pages/edit/${page.id}`)}>Edit</Button>
                </Space>
            )
        },
    ];

    return <PageHeader
        ghost={false}
        title="Pages"
        subTitle="View and edit app pages"
    >
        <Table bordered={true} loading={loadingPages} columns={columns} dataSource={pages} />
    </PageHeader>;
};

export default PageListView;
