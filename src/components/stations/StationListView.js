import React from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

import {Button, PageHeader, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

const StationListView = () => {
    const history = useHistory();

    const loadingStations = useSelector(state => state.stations.isFetching);
    const stations = useSelector(state => state.stations.items);

    const columns = [
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
            render: station => (
                <Space size="middle">
                    <Button icon={<EyeOutlined />} disabled={true}
                            onClick={() => history.push(`/modals/detail/${station.id}`)}>View</Button>
                    <Button icon={<EditOutlined />}
                            onClick={() => history.push(`/stations/edit/${station.id}`)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} danger={true} disabled={true}>Delete</Button>
                </Space>
            ),
        },
    ];

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
               columns={columns}
               rowKey="id"
               dataSource={stations} />
    </PageHeader>;
};

export default StationListView;
