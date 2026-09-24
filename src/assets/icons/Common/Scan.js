import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

function ScanIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={62}
      height={62}
      viewBox="15 15 62 62"
      {...props}>
      <G data-name="Group 29">
        <G data-name="Rectangle 19">
          <Path
            d="M46 15a31 31 0 0131 31 31 31 0 01-31 31 31 31 0 01-31-31 31 31 0 0131-31z"
            fill="rgba(96,23,111,0.1 )"
            fillRule="evenodd"
          />
          <Path
            d="M46 15.5h0A30.5 30.5 0 0176.5 46h0A30.5 30.5 0 0146 76.5h0A30.5 30.5 0 0115.5 46h0A30.5 30.5 0 0146 15.5z"
            strokeLinejoin="round"
            strokeLinecap="round"
            stroke="#7b2281"
            fill="transparent"
            strokeWidth={0.98387}
          />
        </G>
      </G>
    </Svg>
  );
}

export default ScanIcon;
