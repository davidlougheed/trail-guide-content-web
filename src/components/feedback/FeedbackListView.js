import React from "react";
import {useSelector} from "react-redux";

import {Button, PageHeader, Space, Table} from "antd";
import {DeleteOutlined} from "@ant-design/icons";

const FeedbackListView = () => {
    const loadingFeedback = useSelector(state => state.feedback.isFetching);
    const feedback = useSelector(state => state.feedback.items);

    const columns = [
        {
            title: "Name",
            dataIndex: ["from", "name"],
        },
        {
            title: "Email",
            dataIndex:  ["from", "email"],
        },
        {
            title: "Feedback",
            dataIndex: "content",
        },
        {
            title: "Date",
            dataIndex: "submitted",
        },
        {
            title: "Actions",
            key: "actions",
            render: () => (
                <Space size="middle">
                    <Button icon={<DeleteOutlined />} danger={true} disabled={true}>Delete</Button>
                </Space>
            )
        },
    ];

    return <PageHeader
        ghost={false}
        title="Feedback"
        subTitle="View user-submitted app feedback"
    >
        <Table bordered={true} loading={loadingFeedback} columns={columns} dataSource={feedback} rowKey="id" />
    </PageHeader>;
};

export default FeedbackListView;
