import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Travel = props => (
  <Svg
    width={'100%'}
    height={'100%'}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M59.3333 64L53.3333 36.6667L65 25C70 20 71.6667 13.3333 70 10C66.6667 8.33333 60 10 55 15L43.3333 26.6667L16 20.6667C14.3333 20.3333 13 21 12.3333 22.3333L11.3333 24C10.6667 25.6667 11 27.3333 12.3333 28.3333L30 40L23.3333 50H13.3333L10 53.3333L20 60L26.6667 70L30 66.6667V56.6667L40 50L51.6667 67.6667C52.6667 69 54.3333 69.3333 56 68.6667L57.6667 68C59 67 59.6667 65.6667 59.3333 64Z"
      stroke="#60176F"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Travel;
