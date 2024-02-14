import React, {useMemo} from "react";

import {pageAndStationStyles} from "../styles";
import {assetIdToBytesUrl} from "../utils";

const TGCPreviewHeader = ({headerImage, longTitle, subtitle, children}) => {
  const headerImageStyle = useMemo(() => ({
    ...(headerImage ? {
      background: `url(${assetIdToBytesUrl(headerImage)})`,
      backgroundSize: "cover",
    } : {}),
    ...pageAndStationStyles.headerBackground,
  }), [headerImage]);

  return <header className="tgc-preview--header" style={pageAndStationStyles.header}>
    <div style={headerImageStyle}>
      <span style={pageAndStationStyles.headerTitle}>{longTitle}</span>
      {subtitle ? <span style={pageAndStationStyles.subtitle}>{subtitle}</span> : null}
      {children}
    </div>
  </header>;
};

export default TGCPreviewHeader;
