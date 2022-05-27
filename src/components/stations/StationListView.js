import React, {useCallback, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {Button, Modal, PageHeader, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, QrcodeOutlined} from "@ant-design/icons";
import StationQR from "./StationQR";

const StationListView = () => {
  const navigate = useNavigate();

  const loadingStations = useSelector(state => state.stations.isFetching);
  const stations = useSelector(state => state.stations.items);
  const sections = useSelector(state => state.sections.items);
  const categories = useSelector(state => state.categories.items);

  const [qrStation, setQrStation] = useState(null);

  const columns = useMemo(() => [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Section",
      dataIndex: "section",
      filters: sections.map(s => ({text: s.id, value: s.id})),
      onFilter: (value, record) => record.section === value,
    },
    {
      title: "Category",
      dataIndex: "category",
      filters: categories.map(c => ({text: c, value: c})),
      onFilter: (value, record) => record.category === value,
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
        <Space size="small">
          <Button icon={<QrcodeOutlined />}
                  onClick={() => setQrStation(station)}>QR</Button>
          <Button icon={<EyeOutlined />}
                  onClick={() => navigate(`../detail/${station.id}`)}>View</Button>
          <Button icon={<EditOutlined />}
                  onClick={() => navigate(`../edit/${station.id}`)}>Edit</Button>
          <Button icon={<DeleteOutlined />} danger={true} disabled={true}>Delete</Button>
        </Space>
      ),
    },
  ], [navigate]);

  const onAdd = useCallback(() => navigate("../add"), [navigate]);

  return <PageHeader
    ghost={false}
    title="Stations"
    subTitle="Edit and create app stations"
    extra={[
      <Button key="add"
              type="primary"
              icon={<PlusOutlined/>}
              onClick={onAdd}>
        Add New</Button>,
    ]}
  >
    <Modal title={qrStation?.title}
           style={{top: 36}}
           visible={!!qrStation}
           onCancel={() => setQrStation(null)}
           footer={null}>
      {qrStation ? <StationQR station={qrStation} /> : null}
    </Modal>
    <Table bordered={true}
           loading={loadingStations}
           columns={columns}
           rowKey="id"
           dataSource={stations}/>
  </PageHeader>;
};

export default StationListView;
