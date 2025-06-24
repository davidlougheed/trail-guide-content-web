// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

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
