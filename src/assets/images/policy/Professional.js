import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Professional = props => (
  <Svg
    width={'100%'}
    height={'100%'}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M53.3337 70V16.6667C53.3337 14.8986 52.6313 13.2029 51.381 11.9526C50.1308 10.7024 48.4351 10 46.667 10H33.3337C31.5655 10 29.8699 10.7024 28.6196 11.9526C27.3694 13.2029 26.667 14.8986 26.667 16.6667V70"
      stroke="#60176F"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M66.667 23.3333H13.3337C9.65176 23.3333 6.66699 26.318 6.66699 29.9999V63.3333C6.66699 67.0152 9.65176 69.9999 13.3337 69.9999H66.667C70.3489 69.9999 73.3337 67.0152 73.3337 63.3333V29.9999C73.3337 26.318 70.3489 23.3333 66.667 23.3333Z"
      stroke="#60176F"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Professional;
