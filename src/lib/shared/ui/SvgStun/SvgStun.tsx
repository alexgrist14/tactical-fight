import { type CSSProperties, type FC } from "react";

export const SvgStun: FC<{
  className?: string;
  pathStyle?: CSSProperties;
  style?: CSSProperties;
}> = ({ className, pathStyle, style }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style={style}
    >
      <path
        style={pathStyle}
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        d="m6 14l7-12v8h5l-7 12v-8z"
      ></path>
    </svg>
  );
};
