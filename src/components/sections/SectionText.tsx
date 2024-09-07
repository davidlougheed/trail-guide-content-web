import React from "react";
import {useSections} from "../../modules/sections/hooks";

type SectionTextProps = {
  id: string;
};

const SectionText = ({ id }: SectionTextProps) => {
  const { itemsByID: sections } = useSections();
  const section = sections[id];
  if (!section) return <strong>SECTION NOT FOUND</strong>;
  return <div style={{ display: "flex", gap: "0.7em", alignItems: "center" }}>
    <div style={{ backgroundColor: `#${section.color}`, width: "1.2em", height: "1.2em", borderRadius: "100%" }} />
    <span style={{ flex: 1 }}>{section.title}</span>
  </div>
};

export default SectionText;
