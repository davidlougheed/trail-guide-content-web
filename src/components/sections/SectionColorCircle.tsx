import React from "react";

type SectionColorCircleProps = {
  hex: string;
};

const SectionColorCircle = ({ hex }: SectionColorCircleProps) => (
  <div style={{backgroundColor: `#${hex}`, width: "1.2em", height: "1.2em", borderRadius: "100%"}} />
);

export default SectionColorCircle;
