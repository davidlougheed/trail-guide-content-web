import React from "react";
import {API_BASE_URL, APP_BASE_URL} from "../../config";

const StationQR = React.memo(({station}) => {
  const appStationURL = `${APP_BASE_URL}/stations/detail/${station.id}`;
  return <div>
    <img src={`${API_BASE_URL}/stations/${station.id}/qr`}
         style={{width: "100%", height: "auto"}}
         alt={`Station QR: ${station.title}`} />
    <a href={appStationURL}>{appStationURL}</a>
  </div>;
});

export default StationQR;
