import React, {useState} from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

import {Button, Modal, PageHeader, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

import {GeoJSON, MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {transformCoords} from "../../utils";

const LayerListView = () => {
  const history = useHistory();

  const loadingLayers = useSelector(state => state.layers.isFetching);
  const layers = useSelector(state => state.layers.items);

  const stations = useSelector(state => state.stations.items);

  const [showPreview, setShowPreview] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Enabled",
      dataIndex: "enabled",
      render: enabled => enabled ? "Yes" : "No",
    },
    {
      title: "Rank",
      dataIndex: "rank",
    },
    {
      title: "Actions",
      key: "actions",
      render: modal => <Space size="middle">
        <Button icon={<EyeOutlined/>}
                onClick={() => history.push(`/layers/detail/${modal.id}`)}>View</Button>
        <Button icon={<EditOutlined/>}
                onClick={() => history.push(`/layers/edit/${modal.id}`)}>Edit</Button>
        <Button icon={<DeleteOutlined/>} danger={true} disabled={true}>Delete</Button>
      </Space>,
    },
  ];

  return <PageHeader
    ghost={false}
    title="Layers"
    subTitle="View and edit map layers"
    extra={[
      <Button key="preview" icon={<EyeOutlined />} onClick={() => setShowPreview(true)}>Preview Map</Button>,
      <Button key="add"
              type="primary"
              icon={<PlusOutlined/>}
              onClick={() => history.push("/layers/add")}>
        Add New</Button>,
    ]}
  >
    <Modal
      title="Map Preview"
      visible={showPreview}
      footer={null}
      onCancel={() => setShowPreview(false)}
      width={800}
    >
      <MapContainer center={[44.4727488, -76.4295608]} zoom={14} style={{height: 400}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {layers.filter(layer => layer.enabled).map(layer => <GeoJSON key={layer.id} data={layer.geojson} />)}
        {stations.filter(station => station.enabled).map(station => {
          const t = transformCoords(station.coordinates_utm);
          return <Marker position={[t.latitude, t.longitude]}>
            <Popup>
              {station.title}
            </Popup>
          </Marker>;
        })}
      </MapContainer>
    </Modal>
    <Table bordered={true} loading={loadingLayers} columns={columns} dataSource={layers} rowKey="id" />
  </PageHeader>;
};

export default LayerListView;
