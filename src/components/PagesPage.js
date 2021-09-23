import React from "react";
import {useSelector} from "react-redux";

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

const PagesPage = () => {
    const loadingPages = useSelector(state => state.pages.isFetching);
    const pages = useSelector(state => state.pages.items);

    return <>
        <PageHeader
            ghost={false}
            title="Pages"
            subTitle="View and edit app pages"
        >
            <Table bordered={true} loading={loadingPages} columns={COLUMNS} dataSource={pages} />
        </PageHeader>
    </>;
};

export default PagesPage;
