// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import React from "react";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";

import {Button, Descriptions, Divider, PageHeader} from "antd";
import {EditOutlined} from "@ant-design/icons";

import {findItemByID} from "../../utils";
import StationPreview from "./StationPreview";

const StationDetailView = () => {
  const history = useHistory();
  const {id: stationID} = useParams();

  const fetchingStations = useSelector(state => state.stations.isFetching);
  const station = useSelector(state => findItemByID(state.stations.items, stationID));

  const enabled = station?.enabled ? "Yes" : "No";

  return <PageHeader
    ghost={false}
    onBack={() => history.goBack()}
    title={fetchingStations ? "Loading..." : <span>Station: {station?.title}</span>}
    extra={[
      <Button key="edit" icon={<EditOutlined/>} onClick={() => history.push(`/stations/edit/${stationID}`)}>
        Edit
      </Button>,
    ]}
  >
    <Descriptions bordered={true}>
      <Descriptions.Item label="ID">{station?.id ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Title">{station?.title ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Long Title">{station?.long_title ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Subtitle">{station?.subtitle ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Visible">
        {station?.visible?.from ? `${station?.visible?.from} to ${station?.visible?.to}` : enabled}
      </Descriptions.Item>
      <Descriptions.Item label="Enabled">{station?.enabled ? "Yes" : "No"}</Descriptions.Item>
      <Descriptions.Item label="Rank">{station?.rank}</Descriptions.Item>
      <Descriptions.Item label="Coordinates">
        {station?.coordinates_utm?.zone ?? ""}&nbsp;
        {station?.coordinates_utm?.north ?? ""}N&nbsp;
        {station?.coordinates_utm?.east ?? ""}E
      </Descriptions.Item>
    </Descriptions>

    <Divider />

    <StationPreview {...(station ?? {})} />
  </PageHeader>;
};

export default StationDetailView;
