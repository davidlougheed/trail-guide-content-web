import React from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {Button, PageHeader, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

const StationListView = () => {
  const navigate = useNavigate();

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
      title: "Visible",
      render: station =>
        (station.visible.from && station.visible.to)
          ? `${station.visible.from} to ${station.visible.to}`
          : (station.enabled ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: station => (
        <Space size="middle">
          <Button icon={<EyeOutlined/>}
                  onClick={() => navigate(`../detail/${station.id}`)}>View</Button>
          <Button icon={<EditOutlined/>}
                  onClick={() => navigate(`../edit/${station.id}`)}>Edit</Button>
          <Button icon={<DeleteOutlined/>} danger={true} disabled={true}>Delete</Button>
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
              icon={<PlusOutlined/>}
              onClick={() => navigate("../add")}>
        Add New</Button>,
    ]}
  >
    <Table bordered={true}
           loading={loadingStations}
           columns={columns}
           rowKey="id"
           dataSource={stations}/>
  </PageHeader>;
};

export default StationListView;
