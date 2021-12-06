import React from "react";

// TODO: De-duplicate with app itself

import {assetIdToBytesUrl} from "../../utils";

const textShadow = {
  textShadow: "1px 3px 3px rgba(0, 0, 0, 0.8)",
};

const styles = {
  header: {
    backgroundColor: "#0F7470",
    margin: 0,
    marginBottom: 16,
  },
  headerBackground: {
    display: "flex",
    flexDirection: "column",

    padding: 16,
  },
  headerTitle: {
    fontSize: 32,
    marginBottom: 12,
    color: "white",
    ...textShadow,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
    color: "white",
    ...textShadow,
  },
  coordinatesBox: {
    display: "flex",
    flexDirection: "column",

    paddingTop: 8,
    borderTopColor: "rgba(255, 255, 255, 0.3)",
    borderTopWidth: 1,
  },
  coordinatesTitle: {
    color: "white",
    fontWeight: "bold",
    ...textShadow,
  },
  coordinatesItem: {
    color: "white",
    marginTop: 4,
    ...textShadow,
  },
};

const RenderedContent = ({content}) => {
  console.log(content);
  switch (content.content_type) {
    case "html":
      return <div>
        <div dangerouslySetInnerHTML={{__html: content.content_before_fold ?? ""}} />
      </div>;
    case "gallery":
      return "TODO";
    case "quiz":
      return "TODO";
    default:
      return "";
  }
};

const StationPreview = ({long_title, subtitle, coordinates_utm, header_image, contents}) => {
  const {zone, north, east} = coordinates_utm ?? {};

  return <div className="station-preview">
    <div style={styles.header}>
      <div style={{
        ...(header_image ? {
          background: `url(${assetIdToBytesUrl(header_image)})`,
          backgroundSize: "cover",
        } : {}),
        ...styles.headerBackground,
      }}>
        <span style={styles.headerTitle}>{long_title}</span>
        {subtitle ? <span style={styles.subtitle}>{subtitle}</span> : null}
        {coordinates_utm ? (
          <div style={styles.coordinatesBox}>
            <span style={styles.coordinatesTitle}>UTM Coordinates (Zone {zone ?? ""})</span>
            <span style={styles.coordinatesItem}>
              <span style={{fontWeight: "bold"}}>East:</span> {east ?? ""}</span>
            <span style={styles.coordinatesItem}>
              <span style={{fontWeight: "bold"}}>North:</span> {north ?? ""}</span>
          </div>
        ) : null}
      </div>
    </div>
    {(contents ?? []).map((c, i) => <RenderedContent content={c} key={i} />)}
  </div>;
};

export default StationPreview;
