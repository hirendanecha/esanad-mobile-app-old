import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Health = props => (
  <Svg
    width={'100%'}
    height={'100%'}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M53.3337 70V63.3333C53.3337 59.7971 51.9289 56.4057 49.4284 53.9052C46.9279 51.4048 43.5365 50 40.0003 50H20.0003C16.4641 50 13.0727 51.4048 10.5722 53.9052C8.07175 56.4057 6.66699 59.7971 6.66699 63.3333V70"
      stroke="#60176F"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M30.0003 36.6667C37.3641 36.6667 43.3337 30.6971 43.3337 23.3333C43.3337 15.9695 37.3641 10 30.0003 10C22.6365 10 16.667 15.9695 16.667 23.3333C16.667 30.6971 22.6365 36.6667 30.0003 36.6667Z"
      stroke="#60176F"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M73.333 70V63.3333C73.3308 60.3791 72.3475 57.5093 70.5376 55.1744C68.7276 52.8395 66.1934 51.1719 63.333 50.4333"
      stroke="#60176F"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M53.333 10.4333C56.2011 11.1677 58.7431 12.8357 60.5585 15.1744C62.3738 17.5131 63.3592 20.3894 63.3592 23.35C63.3592 26.3106 62.3738 29.1869 60.5585 31.5256C58.7431 33.8643 56.2011 35.5323 53.333 36.2667"
      stroke="#60176F"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Health;
