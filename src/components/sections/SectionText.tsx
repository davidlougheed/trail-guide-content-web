// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

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
