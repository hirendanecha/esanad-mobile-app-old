import * as React from 'react';
import { Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
const BottomTabBackSide = props => (
  <Svg
    width={Dimensions.get('screen').width}
    height={149.5}
    viewBox="0 0 428 155"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M214 0C228.146 0 240.385 8.15921 246.27 20.0282C249.44 26.4221 255.179 32 262.316 32H427.9C427.955 32.0002 428 32.0447 428 32.0996V106.9C428 106.955 427.955 107 427.9 107C427.955 107 428 107.045 428 107.1V141C428 148.732 421.732 155 414 155H14C6.268 155 0 148.732 0 141V107.1C0 107.045 0.0445966 107 0.0996094 107C0.0446918 107 0.000210023 106.955 0 106.9V32.0996C0.000208527 32.0447 0.0446898 32.0002 0.0996094 32H165.684C172.821 32 178.56 26.4221 181.73 20.0282C187.615 8.15921 199.854 0 214 0Z"
      fill="url(#paint0_linear_42_495)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_42_495"
        x1={214}
        y1={0}
        x2={214}
        y2={155}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#800499" />
        <Stop offset={1} stopColor="#60176F" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default BottomTabBackSide;
