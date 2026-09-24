import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Restaurant = props => (
  <Svg
    width={40}
    height={40}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M26.6666 8.33333V21.6667C26.6666 23.5 25.1666 25 23.3333 25H13.3333C11.5 25 9.99998 23.5 9.99998 21.6667V8.33333H26.6666ZM33.3333 5H6.66665V21.6667C6.66665 25.35 9.64998 28.3333 13.3333 28.3333H23.3333C27.0166 28.3333 30 25.35 30 21.6667V16.6667H33.3333C35.1833 16.6667 36.6666 15.1833 36.6666 13.3333V8.33333C36.6666 6.48333 35.1833 5 33.3333 5ZM30 13.3333V8.33333H33.3333V13.3333H30ZM33.3333 31.6667H3.33331V35H33.3333V31.6667Z"
      fill="#60176F"
      stroke="white"
      strokeWidth={1.3}
    />
  </Svg>
);
export default Restaurant;
