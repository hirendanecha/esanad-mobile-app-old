import * as React from 'react';
import Svg, { G, Rect, Mask, Path, Defs, ClipPath } from 'react-native-svg';
const ReferActive = props => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_681_960)">
      <Rect x={0.5} y={0.5} width={23} height={23} rx={11.5} fill="#60176F" />
      <Mask
        id="mask0_681_960"
        style={{
          maskType: 'alpha',
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={24}
        height={24}
      >
        <Rect x={0.5} y={0.5} width={23} height={23} rx={11.5} fill="#60176F" />
      </Mask>
      <G mask="url(#mask0_681_960)">
        <Path
          d="M8.0918 9.81303C8.0918 7.62294 9.86724 5.84749 12.0573 5.84749C14.2474 5.84749 16.0229 7.62294 16.0229 9.81303C16.0229 12.0031 14.2474 13.7786 12.0573 13.7786C9.86724 13.7786 8.0918 12.0031 8.0918 9.81303Z"
          stroke="white"
          strokeWidth={1.5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M4.5 21.28C4.5 17.1379 7.85787 13.78 12 13.78"
          stroke="white"
          strokeWidth={1.5}
          strokeMiterlimit={10}
          strokeLinejoin="round"
        />
        <Path
          d="M18.5635 16.5978H16.5814C14.7519 16.5978 13.2683 18.0802 13.2668 19.9097L13.2658 21.09"
          stroke="white"
          strokeWidth={1.5}
          strokeMiterlimit={10}
        />
        <Path
          d="M16.6427 14.1504L19.1211 16.6288L16.6427 19.1073"
          stroke="white"
          strokeWidth={1.5}
          strokeMiterlimit={10}
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="clip0_681_960">
        <Rect width={24} height={24} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default ReferActive;
