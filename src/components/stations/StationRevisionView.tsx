// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

import {Button, Col, Divider, PageHeader, Row, Select} from "antd";
import {EditOutlined, EyeOutlined} from "@ant-design/icons";

import {useStations} from "../../modules/stations/hooks";
import {Station} from "../../modules/stations/types";
import {ACCESS_TOKEN_READ, detailTitle, fetchStationRevision, findItemByID} from "../../utils";

const stationRevisionTitle = detailTitle("Station revisions", "title");

const styles = {
  revisionSelect: {width: "100%"},
};

const StationRevisionView = React.memo(() => {
  const {getAccessTokenSilently} = useAuth0();

  const navigate = useNavigate();

  const {id: stationID} = useParams();

  const {items: stations, initialFetchDone: stationsInitialFetch, isFetching: stationsFetching} = useStations();
  const station: Station | undefined = useMemo(() => findItemByID<Station>(stations, stationID), [stations]);

  // ----

  const [lhsRevision, setLhsRevision] = useState(undefined);
  const [rhsRevision, setRhsRevision] = useState(undefined);

  const [lhsRevisionData, setLhsRevisionData] = useState(null);
  const [rhsRevisionData, setRhsRevisionData] = useState(null);

  const lhsOptions = useMemo(() => {
    if (lhsRevision === undefined || rhsRevision === undefined) return [];
    if (lhsRevision <= 0 || rhsRevision === 1) return [{value: 0, label: "0"}];
    const n = [];
    for (let i = 1; i < rhsRevision; i++) {
      n.push({value: i, label: i.toString()});
    }
    return n;
  }, [lhsRevision, rhsRevision]);

  const rhsOptions = useMemo(() => {
    if (lhsRevision === undefined || rhsRevision === undefined) return [];
    const n = [];
    if (rhsRevision === 1) return [{value: 1, label: "1 (created)"}];
    for (let i = lhsRevision + 1; i <= rhsRevision; i++) {
      n.push({value: i, label: i === station?.revision?.number ? `${i} (latest)` : i.toString()});
    }
    return n;
  }, [lhsRevision, rhsRevision]);

  useEffect(() => {
    if (station && (lhsRevision === undefined || rhsRevision === undefined)) {
      const rhs = station?.revision?.number;
      if (rhs) {
        setLhsRevision(rhs - 1);
        setRhsRevision(rhs);
        setRhsRevisionData(station);
      }
    }
  }, [station])

  useEffect(() => {
    if (!station) return;
    if (!lhsRevision) return;
    (async () => {
      const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_READ);
      setLhsRevisionData(await fetchStationRevision(station.id, lhsRevision, accessToken));
    })();
  }, [lhsRevision]);

  useEffect(() => {
    if (!station) return;
    if (!rhsRevision) return;
    (async () => {
      const accessToken = await getAccessTokenSilently(ACCESS_TOKEN_READ);
      setRhsRevisionData(await fetchStationRevision(station.id, rhsRevision, accessToken));
    })();
  }, [rhsRevision]);

  // ----

  const onBack = useCallback(() => navigate(-1), [navigate]);
  const viewStation = useCallback(() => navigate(`/stations/detail/${stationID}`), [navigate, stationID]);
  const editStation = useCallback(() => navigate(`/stations/edit/${stationID}`), [navigate, stationID]);

  const onLhsChange = useCallback(v => setLhsRevision(v), []);
  const onRhsChange = useCallback(v => setRhsRevision(v), []);

  const title = useMemo(
    () => stationRevisionTitle(station, stationsInitialFetch, stationsFetching),
    [stationsInitialFetch, stationsFetching, station]);
  const extra = useMemo(() => [
    <Button key="view" icon={<EyeOutlined />} onClick={viewStation}>View</Button>,
    <Button key="edit" icon={<EditOutlined />} onClick={editStation}>Edit</Button>,
  ], [viewStation, editStation]);

  // noinspection JSValidateTypes
  return <PageHeader ghost={false} onBack={onBack} title={title} extra={extra}>
    <Row gutter={16}>
      <Col span={12}>
        <Select options={lhsOptions} value={lhsRevision} style={styles.revisionSelect} onChange={onLhsChange} />
        <Divider />
      </Col>
      <Col span={12}>
        <Select options={rhsOptions} value={rhsRevision} style={styles.revisionSelect} onChange={onRhsChange} />
        <Divider />
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        {lhsRevision > 0
          ? (lhsRevisionData ? <pre>{JSON.stringify(lhsRevisionData, null, 2)}</pre> : <div />)
          : <span style={{fontStyle: "italic", color: "#666"}}>Not created yet.</span>}
      </Col>
      <Col span={12}>
        {rhsRevisionData ? <pre>{JSON.stringify(rhsRevisionData, null, 2)}</pre> : <div />}
      </Col>
    </Row>
  </PageHeader>;
});

export default StationRevisionView;
