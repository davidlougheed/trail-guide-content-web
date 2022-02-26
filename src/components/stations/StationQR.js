import React from "react";
import {BASE_URL} from "../../config";

const StationQR = ({station}) => (
  <img src={`${BASE_URL}/stations/${station.id}/qr`}
       style={{width: "100%", height: "auto"}}
       alt={`Station QR: ${station.title}`} />
);

export default StationQR;
