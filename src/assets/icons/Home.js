import { useThemeContext } from '@theme/ThemeProvider';
import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
const Home = props => {
  const { theme } = useThemeContext();
  return (
    <Svg
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M3.69131 13.2413L4.66665 13.4852L5.19981 18.7842C5.50081 21.7778 5.65131 23.2747 6.65115 24.1788C7.65098 25.083 9.15598 25.083 12.1648 25.083H15.8351C18.8451 25.083 20.3501 25.083 21.3488 24.1788C22.3486 23.2747 22.4991 21.7778 22.8001 18.783L23.3333 13.4863L24.3086 13.2413C24.6423 13.1579 24.9448 12.9803 25.1804 12.7298C25.4159 12.4792 25.5744 12.1662 25.6369 11.8281C25.6995 11.4899 25.6636 11.1409 25.5333 10.8227C25.4031 10.5044 25.1841 10.2303 24.9025 10.033L15.3381 3.33982C14.9459 3.06525 14.4788 2.91797 14 2.91797C13.5212 2.91797 13.054 3.06525 12.6618 3.33982L3.09748 10.033C2.81583 10.2304 2.59688 10.5046 2.46673 10.8229C2.33658 11.1412 2.30073 11.4903 2.36344 11.8285C2.42615 12.1666 2.58478 12.4796 2.82043 12.7301C3.05607 12.9806 3.35762 13.1581 3.69131 13.2413Z"
        stroke={props.color || theme.colors.textTertiary}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.5 18.666C16.5667 19.3917 15.3417 19.8327 14 19.8327C12.6583 19.8327 11.4333 19.3917 10.5 18.666"
        stroke={props.color || theme.colors.textTertiary}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
export default Home;
