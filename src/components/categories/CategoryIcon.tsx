import React from "react";

type CategoryIconProps = {
  path: string;
  fill?: string;
  size?: number;
}

const DEFAULT_SIZE = 30;

const CategoryIcon = React.memo(({ path, fill, size }: CategoryIconProps) => (
  <svg viewBox="-2 -2 29 28" width={size ?? DEFAULT_SIZE} height={size ?? DEFAULT_SIZE}>
    <path fill={fill ?? "black"} d={path} />
  </svg>
));

export default CategoryIcon;
