import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';
const WhatsApp = props => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_639_3119)">
      <Path
        d="M11.9973 1H12.0027C18.0679 1 23 5.93488 23 12C23 18.0651 18.0679 23 12.0027 23C9.76562 23 7.69075 22.3345 5.95138 21.1823L1.72325 22.5339L3.09413 18.4474C1.7755 16.6365 1 14.4062 1 12C1 5.9335 5.93213 1 11.9973 1Z"
        stroke="#4B4B4B"
        strokeWidth={1.5}
      />
      <Path
        d="M16.1533 17.75C17.0471 17.75 17.7499 17.0226 17.75 16.1455V14.4355C17.7499 14.1133 17.5439 13.827 17.2383 13.7246L14.6875 12.8701C14.4673 12.7963 14.2253 12.829 14.0322 12.958L13.1074 13.5762C12.6266 13.318 12.0859 12.9081 11.5859 12.4121C11.0855 11.9156 10.6737 11.38 10.416 10.9023L11.0332 9.97363C11.161 9.78134 11.1939 9.54039 11.1211 9.32129L10.2686 6.7627C10.1665 6.45647 9.87945 6.25 9.55664 6.25H7.85254C6.97261 6.25 6.25 6.95745 6.25 7.84863C6.25 10.4427 7.46798 12.9138 9.28223 14.7256C11.0962 16.537 13.5669 17.7499 16.1533 17.75Z"
        stroke="#4B4B4B"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_639_3119">
        <Rect width={24} height={24} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default WhatsApp;
