import React, {useEffect, useMemo, useState} from "react";

// TODO: De-duplicate with app itself

import {assetIdToBytesUrl} from "../../utils";
import {Button, Image, Typography} from "antd";
import Quiz from "../Quiz";
import HTMLContent from "../HTMLContent";

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
  boldText: {fontWeight: "bold"},

  quiz: {marginBottom: 8},

  galleryItem: {display: "inline-block", paddingRight: 16, paddingBottom: 8},
};

const RenderedContent = React.memo(({id, content}) => {
  const [showMore, setShowMore] = useState(false);

  switch (content.content_type) {
    case "html":
      return <>
        {content.title ? <Typography.Title level={4}>{content.title}</Typography.Title> : null}
        <HTMLContent id={`${id}-content-before`} htmlContent={content.content_before_fold ?? ""} />
        {content.content_after_fold
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
      return "";
  }
});

const StationPreview = React.memo(({long_title, subtitle, coordinates_utm, header_image, contents}) => {
  const {zone, north, east} = coordinates_utm ?? {};

  useEffect(() => {
    document.querySelectorAll("tgcs-audio").forEach(el => {
      el.addEventListener("click", () => {
        const audio = el.querySelector("audio");
        if (audio.paused) { audio.play().catch(console.error); }
        else { audio.load(); }
      });
    });
  }, [contents]);

  const headerImageStyle = useMemo(() => ({
    ...(header_image ? {
      background: `url(${assetIdToBytesUrl(header_image)})`,
      backgroundSize: "cover",
    } : {}),
    ...styles.headerBackground,
  }), [header_image]);

  return <div className="station-preview">
    <div style={styles.header}>
      <div style={headerImageStyle}>
        <span style={styles.headerTitle}>{long_title}</span>
        {subtitle ? <span style={styles.subtitle}>{subtitle}</span> : null}
        {coordinates_utm ? (
          <div style={styles.coordinatesBox}>
            <span style={styles.coordinatesTitle}>UTM Coordinates (Zone {zone ?? ""})</span>
            <span style={styles.coordinatesItem}>
              <span style={styles.boldText}>East:</span> {east ?? ""}</span>
            <span style={styles.coordinatesItem}>
              <span style={styles.boldText}>North:</span> {north ?? ""}</span>
          </div>
        ) : null}
      </div>
    </div>
    {(contents ?? []).map((c, i) => <RenderedContent id={`station-${i}`} content={c} key={i} />)}
  </div>;
});

export default StationPreview;
