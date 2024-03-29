// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React, {CSSProperties, useCallback, useMemo, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";

import {Button, Descriptions, Divider, Modal, PageHeader} from "antd";
import {EditOutlined, QrcodeOutlined} from "@ant-design/icons";

import {detailTitle, findItemByID, timestampToString} from "../../utils";

import StationPreview from "./StationPreview";
import StationQR from "./StationQR";

import {useAppSelector} from "../../hooks";
import type {Station} from "../../modules/stations/types";

const styles = {
  revision: {marginTop: 16} as CSSProperties,
  stationPreviewContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  } as CSSProperties,
};

const stationDetailTitle = detailTitle("Station", "title");

const StationDetailView = React.memo(() => {
  const navigate = useNavigate();

  const {id: stationID} = useParams();

  const stationsInitialFetch = useAppSelector(state => state.stations.initialFetchDone);
  const stationsFetching = useAppSelector(state => state.stations.isFetching);
  const station: Station | undefined = useAppSelector(
    state => findItemByID<Station>(state.stations.items, stationID));

  const [qrModalOpen, setQrModalOpen] = useState(false);

  const onBack = useCallback(() => navigate(-1), [navigate]);
  const showQrModal = useCallback(() => setQrModalOpen(true), []);
  const hideQrModal = useCallback(() => setQrModalOpen(false), []);
  const editStation = useCallback(() => navigate(`/stations/edit/${stationID}`), [navigate, stationID]);

  const title = useMemo(
    () => stationDetailTitle(station, stationsInitialFetch, stationsFetching),
    [stationsInitialFetch, stationsFetching, station]);
  const extra = useMemo(() => [
    <Button key="qr" icon={<QrcodeOutlined />} onClick={showQrModal}>QR Code</Button>,
    <Button key="edit" icon={<EditOutlined/>} onClick={editStation}>Edit</Button>,
  ], [showQrModal, editStation]);

  const enabled = station?.enabled ? "Yes" : "No";

  return <PageHeader ghost={false} onBack={onBack} title={title} extra={extra}>
    <Modal open={qrModalOpen} onCancel={hideQrModal} footer={null}>
      {station ? <StationQR station={station} /> : null}
    </Modal>
    <Descriptions bordered={true} size="small" column={4}>
      <Descriptions.Item label="ID" span={2}>{station?.id ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Title" span={2}>{station?.title ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Long Title" span={2}>{station?.long_title ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Subtitle" span={2}>{station?.subtitle ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Visible" span={2}>
        {station?.visible?.from ? `${station?.visible?.from} to ${station?.visible?.to}` : enabled}
      </Descriptions.Item>
      <Descriptions.Item label="Enabled" span={2}>{station?.enabled ? "Yes" : "No"}</Descriptions.Item>
      <Descriptions.Item label="Rank" span={2}>{station?.rank}</Descriptions.Item>
      <Descriptions.Item label="Coordinates" span={2}>
        {station?.coordinates_utm?.crs ?? ""}&nbsp;
        Zone&nbsp;{station?.coordinates_utm?.zone ?? ""}&nbsp;
        {station?.coordinates_utm?.north ?? ""}N&nbsp;
        {station?.coordinates_utm?.east ?? ""}E
      </Descriptions.Item>
    </Descriptions>

    <Descriptions bordered={true} size="small" style={styles.revision}>
      <Descriptions.Item label="Revision" span={1}>
        <Link to={`/stations/revision/${station?.id}`}>{station?.revision?.number ?? ""}</Link>
      </Descriptions.Item>
      <Descriptions.Item label="Update" span={1}>{station?.revision?.message ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Last Updated" span={1}>
        {timestampToString(station?.revision?.timestamp) ?? ""}
      </Descriptions.Item>
    </Descriptions>

    <Divider />

    <div style={styles.stationPreviewContainer}>
      {station ? <StationPreview {...station} /> : null}
    </div>
  </PageHeader>;
});

export default StationDetailView;
