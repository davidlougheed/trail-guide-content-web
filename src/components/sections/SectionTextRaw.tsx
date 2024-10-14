// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React from "react";
import SectionColorCircle from "./SectionColorCircle";

type SectionTextRawProps = {
  title: string;
  color: string;
};

const SectionTextRaw = ({ title, color }: SectionTextRawProps) => (
  <div style={{ display: "flex", gap: "0.7em", alignItems: "center" }}>
    <SectionColorCircle hex={color} />
    <span style={{ flex: 1 }}>{title}</span>
  </div>
);

export default SectionTextRaw;
