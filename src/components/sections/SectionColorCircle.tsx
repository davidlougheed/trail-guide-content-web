// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React from "react";

type SectionColorCircleProps = {
  hex: string;
};

const SectionColorCircle = ({ hex }: SectionColorCircleProps) => (
  <div style={{backgroundColor: `#${hex}`, width: "1.2em", height: "1.2em", borderRadius: "100%"}} />
);

export default SectionColorCircle;
