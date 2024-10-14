// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React, {CSSProperties} from "react";
import {API_BASE_URL, APP_BASE_URL} from "../../config";

import type {Station} from "../../modules/stations/types";

const styles = {
  img: {width: "100%", height: "auto"} as CSSProperties,
};

const StationQR = React.memo(({station}: {station: Station}) => {
  const appStationURL = `${APP_BASE_URL}/stations/detail/${station.id}`;
  return <div>
    <img src={`${API_BASE_URL}/stations/${station.id}/qr`}
         style={styles.img}
         alt={`Station QR: ${station.title}`} />
    <a href={appStationURL}>{appStationURL}</a>
  </div>;
});

export default StationQR;
