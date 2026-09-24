import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const RentCar = props => (
  <Svg
    width={'100%'}
    height={'100%'}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M65.2 54H72.4C74.56 54 76 52.56 76 50.4V39.6C76 36.36 73.48 33.48 70.6 32.76C64.12 30.96 54.4 28.8 54.4 28.8C54.4 28.8 49.72 23.76 46.48 20.52C44.68 19.08 42.52 18 40 18H14.8C12.64 18 10.84 19.44 9.76 21.24L4.72 31.68C4.24329 33.0704 4 34.5301 4 36V50.4C4 52.56 5.44 54 7.6 54H14.8"
      stroke="#60176F"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21.9998 61.2001C25.9763 61.2001 29.1998 57.9765 29.1998 54.0001C29.1998 50.0236 25.9763 46.8 21.9998 46.8C18.0234 46.8 14.7998 50.0236 14.7998 54.0001C14.7998 57.9765 18.0234 61.2001 21.9998 61.2001Z"
      stroke="#60176F"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M29.2002 54.0002H50.8002"
      stroke="#60176F"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M57.9998 61.2001C61.9763 61.2001 65.1998 57.9765 65.1998 54.0001C65.1998 50.0236 61.9763 46.8 57.9998 46.8C54.0234 46.8 50.7998 50.0236 50.7998 54.0001C50.7998 57.9765 54.0234 61.2001 57.9998 61.2001Z"
      stroke="#60176F"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default RentCar;
