import React from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

import {Button, PageHeader, Space, Table} from "antd";
import {PlusOutlined} from "@ant-design/icons";

const COLUMNS = [
    {
        title: "Title",
        dataIndex: "title",
    },
    {
        title: "Section",
        dataIndex: "section",
    },
    {
        title: "Category",
        dataIndex: "category",
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

const StationListView = () => {
    const history = useHistory();

    const loadingStations = useSelector(state => state.stations.isFetching);
    const stations = useSelector(state => state.stations.items);

    return <PageHeader
        ghost={false}
        title="Stations"
        subTitle="Edit and create app stations"
        extra={[
            <Button key="add"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => history.push("/stations/add")}>
                Add New</Button>,
        ]}
    >
        <Table bordered={true}
               loading={loadingStations}
               columns={COLUMNS}
               rowKey="id"
               dataSource={stations} />
    </PageHeader>;
};

export default StationListView;
