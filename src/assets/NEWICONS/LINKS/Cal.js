import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const Cal = props => (
  <Svg
    width={'100%'}
    height={'100%'}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M18.75 0.75H5.25C4.42157 0.75 3.75 1.42157 3.75 2.25V21.75C3.75 22.5784 4.42157 23.25 5.25 23.25H18.75C19.5784 23.25 20.25 22.5784 20.25 21.75V2.25C20.25 1.42157 19.5784 0.75 18.75 0.75Z"
      stroke={props.color || '#60176F'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.2857 4H7.71429C7.3198 4 7 4.29848 7 4.66667V7.33333C7 7.70152 7.3198 8 7.71429 8H16.2857C16.6802 8 17 7.70152 17 7.33333V4.66667C17 4.29848 16.6802 4 16.2857 4Z"
      stroke={props.color || '#60176F'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 12H7"
      stroke={props.color || '#60176F'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.5 12H11.5"
      stroke={props.color || '#60176F'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 12H16"
      stroke={props.color || '#60176F'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 15H7"
      stroke={props.color || '#60176F'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.5 15H11.5"
      stroke={props.color || '#60176F'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 15H16"
      stroke={props.color || '#60176F'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 18H7"
      stroke={props.color || '#60176F'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.5 18H11.5"
      stroke={props.color || '#60176F'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 18H16"
      stroke={props.color || '#60176F'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default Cal;
