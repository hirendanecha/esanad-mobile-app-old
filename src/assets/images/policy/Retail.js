import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Retail = props => (
  <Svg
    width={40}
    height={40}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M26 11.8947V8.94737C26 7.31158 24.665 6 23 6H17C15.335 6 14 7.31158 14 8.94737V11.8947H5V31.0526C5 32.6884 6.335 34 8 34H32C33.665 34 35 32.6884 35 31.0526V11.8947H26ZM17 8.94737H23V11.8947H17V8.94737ZM32 31.0526H8V14.8421H32V31.0526ZM15.5 29.5789L26.75 22.2105L15.5 16.3158V29.5789Z"
      fill="#60176F"
      stroke="white"
      strokeWidth={1.3}
    />
  </Svg>
);
export default Retail;
