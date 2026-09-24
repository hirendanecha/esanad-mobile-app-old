import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Self = props => (
  <Svg
    width={'100%'}
    height={'100%'}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M62.4 46.4444C67.168 41.74 72 36.1011 72 28.7222C72 24.022 70.1457 19.5143 66.8451 16.1907C63.5444 12.8672 59.0678 11 54.4 11C48.768 11 44.8 12.6111 40 17.4444C35.2 12.6111 31.232 11 25.6 11C20.9322 11 16.4556 12.8672 13.1549 16.1907C9.85428 19.5143 8 24.022 8 28.7222C8 36.1333 12.8 41.7722 17.6 46.4444L40 69L62.4 46.4444Z"
      stroke="#60176F"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Self;
