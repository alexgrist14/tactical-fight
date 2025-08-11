import { type CSSProperties, type FC } from "react";

export const SvgShield: FC<{
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
        fill="currentColor"
        d="M12 22q-3.475-.875-5.738-3.988T4 11.1V5l8-3l8 3v6.1q0 3.8-2.262 6.913T12 22"
      ></path>
    </svg>
  );
};
