import React, {useCallback, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {Button, Modal, PageHeader, Space, Table, Tooltip} from "antd";
import {
  CloseSquareOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  QrcodeOutlined
} from "@ant-design/icons";
import StationQR from "./StationQR";
import {useUrlPagination} from "../../hooks/pages";
import {useCategories} from "../../modules/categories/hooks";
import {deleteStation, updateStation} from "../../modules/stations/actions";
import {ACCESS_TOKEN_MANAGE, timestampToString} from "../../utils";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {Station} from "../../modules/stations/types";

const styles = {
  qrModal: {top: 36},
};

const StationListView = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {getAccessTokenSilently} = useAuth0();

  const stationsInitialFetch = useAppSelector(state => state.stations.initialFetchDone);
  const stationsFetching = useAppSelector(state => state.stations.isFetching);
  const stations = useAppSelector(state => state.stations.items);

  const sections = useAppSelector(state => state.sections.items);
  const {items: categories} = useCategories();

  const [qrStation, setQrStation] = useState<Station | null>(null);
  const [delStation, setDelStation] = useState<Station | null>(null);

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
      filters: categories.map(({id: c}) => ({text: c, value: c})),
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
      title: "Last Modified",
      sorter: (a: Station, b: Station): number =>
        (new Date(a.revision.timestamp)).getTime() - (new Date(b.revision.timestamp)).getTime(),
      render: station => timestampToString(station.revision.timestamp),
    },
    {
      title: "Actions",
      key: "actions",
      render: station => (
        <Space size="small">
          <Tooltip title="Show QR Code">
          <Button icon={<QrcodeOutlined />}
                  onClick={() => setQrStation(station)} />
          </Tooltip>
          <Button icon={<EyeOutlined />}
                  onClick={() => navigate(`../detail/${station.id}`)}>View</Button>
          <Button icon={<EditOutlined />}
                  onClick={() => navigate(`../edit/${station.id}`)}>Edit</Button>
          <Button icon={<DeleteOutlined />} danger={true} onClick={() => setDelStation(station)}>Delete</Button>
        </Space>
      ),
    },
  ], [navigate]);

  const onAdd = useCallback(() => navigate("../add"), [navigate]);
  const extra = useMemo(() => [
    <Button key="add"
            type="primary"
            icon={<PlusOutlined/>}
            onClick={onAdd}>
      Add New</Button>,
  ], [onAdd]);

  const closeQrModal = useCallback(() => setQrStation(null), []);
  const closeDelModal = useCallback(() => setDelStation(null), []);

  const onDisable = useCallback(async () => {
    if (!delStation) return;
    try {
      const token = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
      await dispatch(updateStation(delStation.id, {
        enabled: false,
        revision: {
          working_copy: delStation.revision?.number ?? null,
        },
      }, token));
    } catch (e) {
      console.error(e);
    }
    closeDelModal();
  }, [dispatch, getAccessTokenSilently, delStation]);

  const onDelete = useCallback(async () => {
    if (!delStation) return;
    try {
      const token = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
      await dispatch(deleteStation(delStation.id, token));
    } catch (e) {
      console.error(e);
    }
    closeDelModal();
  }, [dispatch, getAccessTokenSilently, delStation]);

  const pagination = useUrlPagination();

  return <PageHeader ghost={false} title="Stations" subTitle="Edit and create app stations" extra={extra}>
    <Modal title={qrStation?.title}
           style={styles.qrModal}
           open={!!qrStation}
           onCancel={closeQrModal}
           footer={null}>
      {qrStation ? <StationQR station={qrStation} /> : null}
    </Modal>
    <Modal title={`Delete station: ${delStation?.title}`}
           open={!!delStation}
           onCancel={closeDelModal}
           footer={<Space>
             <Button type="primary"
                     danger={true}
                     icon={<DeleteOutlined />}
                     onClick={onDelete}>Delete</Button>
             {delStation?.enabled
               ? <Button type="primary"
                         icon={<CloseSquareOutlined />}
                         onClick={onDisable}>Disable</Button>
               : null}
             <Button onClick={closeDelModal}>Cancel</Button>
           </Space>}>
      Are you sure you wish to delete the station &ldquo;{delStation?.title}&rdquo;? If other content refers to
      this station, those links will be <strong>broken</strong>.&nbsp;
      {delStation?.enabled ? <span>
        If you wish, you can instead <a href="#" onClick={onDisable}>disable</a> this station.
      </span> : ""}
    </Modal>
    <Table
      bordered={true}
      size="small"
      loading={!stationsInitialFetch && stationsFetching}
      columns={columns}
      rowKey="id"
      dataSource={stations}
      pagination={pagination}
    />
  </PageHeader>;
});

export default StationListView;
