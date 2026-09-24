import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Medical = props => (
  <Svg
    width={40}
    height={40}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path d="M24 6H4V6.0001H24V6Z" stroke="#60176F" strokeWidth={1.7} />
    <Path
      d="M2.5 35H25.8333V10H2.5V35ZM7.5 20H11.6667V15.8333H16.6667V20H20.8333V25H16.6667V29.1667H11.6667V25H7.5V20Z"
      stroke="#60176F"
      strokeWidth={1.7}
    />
    <Path
      d="M32.5 10C29.7 10 27.5 12.9333 27.5 16.6667C27.5 19.6167 28.8833 22.0333 30.8333 22.9333V35H34.1667V22.9333C36.1167 22.0333 37.5 19.6167 37.5 16.6667C37.5 12.9333 35.3 10 32.5 10Z"
      stroke="#60176F"
      strokeWidth={1.7}
    />
  </Svg>
);
export default Medical;
