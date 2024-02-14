import React, {CSSProperties, useState} from "react";

// TODO: De-duplicate with app itself

import {Button, Image, Typography} from "antd";

import Quiz from "../Quiz";
import HTMLContent from "../HTMLContent";
import TGCPreviewHeader from "../TGCPreviewHeader";
import TGCPreviewContent from "../TGCPreviewContent";

import {pageAndStationStyles} from "../../styles";
import {assetIdToBytesUrl} from "../../utils";
import {Station, StationContentItem} from "../../modules/stations/types";

const styles: {[key: string]: CSSProperties} = {
  ...pageAndStationStyles,

  stationPreview: {
    border: "4px solid #333",
    borderRadius: 9,
    paddingBottom: 16,
    overflow: "hidden",
    maxWidth: 768,
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
    ...pageAndStationStyles.textShadow,
  },
  coordinatesItem: {
    color: "white",
    marginTop: 4,
    ...pageAndStationStyles.textShadow,
  },

  contentItem: {
    borderTop: "2px solid #F9F9F9",
    padding: 16,
    paddingBottom: 0,
  },

  quiz: {marginBottom: 8},

  galleryItem: {
    display: "inline-block",
    verticalAlign: "top",
    paddingRight: 16,
    paddingBottom: 8,
  },
};

const RenderedContent = React.memo(({id, content}: ({id: string, content: StationContentItem})) => {
  const [showMore, setShowMore] = useState(false);

  switch (content.content_type) {
    case "html":
      return <>
        {content.title ? <Typography.Title level={4}>{content.title}</Typography.Title> : null}
        <HTMLContent id={`${id}-content-before`} htmlContent={content.content_before_fold ?? ""} />
        {(content.content_after_fold && content.content_after_fold !== "<p><br></p>")
          ? <Button onClick={() => setShowMore(!showMore)} style={{marginBottom: 16}}>
            {showMore ? "HIDE" : "READ MORE"}</Button> : null}
        {showMore
          ? <HTMLContent id={`${id}-content-after`} htmlContent={content.content_after_fold ?? ""} />
          : null}
      </>;
    case "gallery":
      return <>
        {content.title ? <Typography.Title level={4}>{content.title}</Typography.Title> : null}
        <HTMLContent id={`${id}-gallery-content`} htmlContent={content.description ?? ""} />
        <Image.PreviewGroup>
          {content.items.map(i => (
            <div key={i.asset} style={styles.galleryItem}>
              <Image height={180} src={assetIdToBytesUrl(i.asset)} alt={i.caption} /> <br />
              <Typography.Text>{i.caption}</Typography.Text>
            </div>
          ))}
        </Image.PreviewGroup>
      </>;
    case "quiz":
      return <Quiz {...content} style={styles.quiz} />;
    default:
      return <React.Fragment />;
  }
});

const StationPreview = React.memo(
  ({long_title, subtitle, coordinates_utm, header_image, contents}: Station) => {
    const {crs, zone, north, east} = coordinates_utm ?? {};

    return <div className="tgc-preview station-preview" style={styles.stationPreview}>
      <TGCPreviewHeader headerImage={header_image} longTitle={long_title} subtitle={subtitle}>
        {coordinates_utm ? (
          <div style={styles.coordinatesBox}>
            <span style={styles.coordinatesTitle}>UTM Coordinates ({crs ?? ""} Zone {zone ?? ""})</span>
            <span style={styles.coordinatesItem}>
                <span style={styles.boldText}>East:</span> {east ?? ""}</span>
            <span style={styles.coordinatesItem}>
                <span style={styles.boldText}>North:</span> {north ?? ""}</span>
          </div>
        ) : null}
      </TGCPreviewHeader>
      <TGCPreviewContent>
        {(contents ?? []).map((c, i) => <div key={i} style={styles.contentItem}>
          <RenderedContent id={`station-${i}`} content={c} />
        </div>)}
      </TGCPreviewContent>
    </div>;
  });

export default StationPreview;
