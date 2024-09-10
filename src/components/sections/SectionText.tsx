import React from "react";
import {useSections} from "../../modules/sections/hooks";
import SectionTextRaw from "./SectionTextRaw";

type SectionTextProps = {
  id: string;
};

const SectionText = ({ id }: SectionTextProps) => {
  const { itemsByID: sections } = useSections();
  const section = sections[id];
  if (!section) return <strong>SECTION NOT FOUND</strong>;
  return <SectionTextRaw title={section.title} color={section.color} />;
};

export default SectionText;
