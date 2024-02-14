import {CSSProperties} from "react";

export const helpText: CSSProperties = {
  fontSize: "0.9em",
  color: "#999",
  fontStyle: "italic",
};

const pageAndStationTextShadow: CSSProperties = {
  textShadow: "1px 3px 3px rgba(0, 0, 0, 0.8)",
};

export const pageAndStationStyles: {[key: string]: CSSProperties} = {
  header: {
    backgroundColor: "#0F7470",
    margin: 0,
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
    ...pageAndStationTextShadow,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
    color: "white",
    ...pageAndStationTextShadow,
  },

  textShadow: pageAndStationTextShadow,
  boldText: {fontWeight: "bold"},
};

export default {
  helpText,
};
