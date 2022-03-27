import React from "react";
import {API_BASE_URL, APP_BASE_URL} from "../../config";

const PageQR = ({page}) => {
  const pageURL = `${APP_BASE_URL}/pages/${page.id}`;
  return <div>
    <img src={`${API_BASE_URL}/pages/${page.id}/qr`}
         style={{width: "100%", height: "auto"}}
         alt={`Page QR: ${page.title}`} />
    <a href={pageURL}>{pageURL}</a>
  </div>;
}

export default PageQR;
