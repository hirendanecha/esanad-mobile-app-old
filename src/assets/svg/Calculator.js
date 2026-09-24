import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
const Calculator = props => (
  <Svg
    width={'100%'}
    height={'100%'}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M31.25 1.25H8.75C7.36928 1.25 6.25 2.36928 6.25 3.75V36.25C6.25 37.6307 7.36928 38.75 8.75 38.75H31.25C32.6307 38.75 33.75 37.6307 33.75 36.25V3.75C33.75 2.36928 32.6307 1.25 31.25 1.25Z"
      fill="#1C1C1C"
    />
    <Path
      d="M29.4285 4H10.5714C9.70356 4 9 4.97006 9 6.16668V14.8333C9 16.0299 9.70356 17 10.5714 17H29.4285C30.2964 17 31 16.0299 31 14.8333V6.16668C31 4.97006 30.2964 4 29.4285 4Z"
      fill="white"
    />
    <Rect x={9} y={20} width={4} height={4} rx={2} fill="white" />
    <Rect x={9} y={26} width={4} height={4} rx={2} fill="white" />
    <Rect x={9} y={32} width={4} height={4} rx={2} fill="white" />
    <Rect x={21} y={32} width={10} height={4} rx={2} fill="#FFAD0C" />
    <Rect x={15} y={20} width={4} height={4} rx={2} fill="white" />
    <Rect x={15} y={26} width={4} height={4} rx={2} fill="white" />
    <Rect x={15} y={32} width={4} height={4} rx={2} fill="white" />
    <Rect x={27} y={20} width={4} height={4} rx={2} fill="#D53D25" />
    <Rect x={27} y={26} width={4} height={4} rx={2} fill="#D53D25" />
    <Rect x={21} y={20} width={4} height={4} rx={2} fill="white" />
    <Rect x={21} y={26} width={4} height={4} rx={2} fill="white" />
  </Svg>
);
export default Calculator;
