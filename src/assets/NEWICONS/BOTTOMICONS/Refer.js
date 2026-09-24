import * as React from 'react';
import Svg, { G, Rect, Path, Defs, ClipPath } from 'react-native-svg';
const Refer = props => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_681_910)">
      <Rect
        x={1.25}
        y={1.25}
        width={21.5}
        height={21.5}
        rx={10.75}
        stroke="#8B8E8B"
        strokeWidth={1.5}
      />
      <Path
        d="M8.3916 9.81553C8.3916 7.62544 10.167 5.85 12.3571 5.85C14.5472 5.85 16.3227 7.62544 16.3227 9.81553C16.3227 12.0056 14.5472 13.7811 12.3571 13.7811C10.167 13.7811 8.3916 12.0056 8.3916 9.81553Z"
        stroke="#8B8E8B"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.2995 13.7825C8.54751 13.7825 5.439 16.5376 4.88672 20.1351"
        stroke="#8B8E8B"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinejoin="round"
      />
      <Path
        d="M18.8633 16.6003H16.8813C15.0517 16.6003 13.5681 18.0827 13.5666 19.9122L13.5656 21.0925"
        stroke="#8B8E8B"
        strokeWidth={1.5}
        strokeMiterlimit={10}
      />
      <Path
        d="M16.9425 14.1529L19.4209 16.6313L16.9425 19.1098"
        stroke="#8B8E8B"
        strokeWidth={1.5}
        strokeMiterlimit={10}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_681_910">
        <Rect width={24} height={24} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default Refer;
