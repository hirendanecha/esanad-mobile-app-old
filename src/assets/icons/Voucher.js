import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';
const Voucher = props => (
  <Svg
    width={36}
    height={36}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_529_213)">
      <Path
        d="M8.67424 14.9037L28.5241 3.44342L30.2819 6.48802C29.4412 6.97346 29.1531 8.04854 29.6385 8.88926C30.1239 9.72999 31.199 10.0181 32.0397 9.53262L33.7975 12.5772C33.011 13.0313 32.7082 14.0015 33.0698 14.813M10.4414 20.6035L6.92578 26.9316M6.92578 20.6035H6.92627M10.4409 26.9315H10.4414M14.8359 15.33V32.205M0.773438 14.9785H35.2266V18.4941C34.2558 18.4941 33.4688 19.2811 33.4688 20.2519C33.4688 21.2227 34.2558 22.0097 35.2266 22.0097V25.5253C34.2558 25.5253 33.4688 26.3123 33.4688 27.2831C33.4688 28.2539 34.2558 29.0409 35.2266 29.0409V32.5565H0.773438V29.0409C1.74424 29.0409 2.53125 28.2539 2.53125 27.2831C2.53125 26.3123 1.74424 25.5253 0.773438 25.5253V22.0097C1.74424 22.0097 2.53125 21.2227 2.53125 20.2519C2.53125 19.2811 1.74424 18.4941 0.773438 18.4941V14.9785Z"
        stroke="#111111"
        strokeWidth={2}
        strokeMiterlimit={22.9256}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.2305 20.6035H29.0742M19.2305 23.7675H29.0742M19.2305 26.9316H24.1523"
        stroke="#60176F"
        strokeWidth={2}
        strokeMiterlimit={22.9256}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_529_213">
        <Rect width={36} height={36} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default Voucher;
