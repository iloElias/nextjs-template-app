import { useSolar } from "@solar-icons/react";
import { IconProps } from "@solar-icons/react/lib/types";

export const BulleList: React.FC<IconProps> = ({ ...props }) => {
  const {
    value: { size },
    svgProps,
  } = useSolar();

  return (
    <svg
      height={size}
      width={size}
      {...svgProps}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 19L10.5 19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        opacity="0.5"
        d="M22 12L10.5 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M22 5L10.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="4" cy="19" r="2" fill="currentColor" />
      <circle opacity="0.5" cx="4" cy="12" r="2" fill="currentColor" />
      <circle cx="4" cy="5" r="2" fill="currentColor" />
    </svg>
  );
};
