import React from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

import {Button, PageHeader, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";

const ModalListView = () => {
    const history = useHistory();

    const loadingModals = useSelector(state => state.modals.isFetching);
    const modals = useSelector(state => state.modals.items);

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
        },
        {
            title: "Close Button Text",
            dataIndex: "close_text",
        },
        {
            title: "Actions",
            key: "actions",
            render: page => <Space size="middle">
                <Button icon={<EditOutlined />}
                        onClick={() => history.push(`/modals/edit/${page.id}`)}>Edit</Button>
                <Button icon={<DeleteOutlined />} danger={true} disabled={true}>Delete</Button>
            </Space>,
        },
    ];

    return <PageHeader
        ghost={false}
        title="Modals"
        subTitle="View and edit app modals"
        extra={[
            <Button key="add"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => history.push("/modals/add")}>
                Add New</Button>,
        ]}
    >
        <Table bordered={true} loading={loadingModals} columns={columns} dataSource={modals} rowKey="id" />
    </PageHeader>;
};

export default ModalListView;
