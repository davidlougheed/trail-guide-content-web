import React, {CSSProperties} from "react";
import {API_BASE_URL, APP_BASE_URL} from "../../config";
import {Page} from "../../modules/pages/types";

const styles: Record<string, CSSProperties> = {
  img: {width: "100%", height: "auto"},
};

const PageQR = React.memo(({page}: {page: Page}) => {
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
