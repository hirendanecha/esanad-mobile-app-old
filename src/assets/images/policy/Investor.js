import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Investor = props => (
  <Svg
    width={'100%'}
    height={'100%'}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M40 6.66663V73.3333"
      stroke="#60176F"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M56.6667 16.6666H31.6667C28.5725 16.6666 25.605 17.8958 23.4171 20.0837C21.2292 22.2716 20 25.2391 20 28.3333C20 31.4275 21.2292 34.3949 23.4171 36.5829C25.605 38.7708 28.5725 40 31.6667 40H48.3333C51.4275 40 54.395 41.2291 56.5829 43.417C58.7708 45.605 60 48.5724 60 51.6666C60 54.7608 58.7708 57.7283 56.5829 59.9162C54.395 62.1041 51.4275 63.3333 48.3333 63.3333H20"
      stroke="#60176F"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Investor;
