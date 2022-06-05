import React from "react";
import {API_BASE_URL, APP_BASE_URL} from "../../config";

const styles = {
  img: {width: "100%", height: "auto"},
};

const PageQR = React.memo(({page}) => {
  if (!page) return <div />;
  const pageURL = `${APP_BASE_URL}/pages/${page.id}`;
  return <div>
    <img src={`${API_BASE_URL}/pages/${page.id}/qr`}
         style={styles.img}
         alt={`Page QR: ${page.title}`} />
    <a href={pageURL}>{pageURL}</a>
  </div>;
});

export default PageQR;
