import * as React from 'react';
import Svg, {G, Path, Image} from 'react-native-svg';

function StepsIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={351}
      height={63.05}
      viewBox="38.5 136.95 351 63.05"
      {...props}>
      <G data-name="Steps">
        <Path
          d="M74 153h292a4 4 0 014 4 4 4 0 01-4 4H74a4 4 0 01-4-4 4 4 0 014-4z"
          fill="#f6f6f6"
          fillRule="evenodd"
          data-name="Rectangle 42"
        />
        <Path
          d="M64 153h62a4 4 0 014 4 4 4 0 01-4 4H64a4 4 0 01-4-4 4 4 0 014-4z"
          fill="#7b2281"
          fillRule="evenodd"
          data-name="Rectangle 65"
        />
        <G data-name="Group 34" transform="translate(-1069.694 21.306)">
          <Path
            d="M1123.694 135.594a20 20 0 110 .1z"
            fill="#7b2281"
            fillRule="evenodd"
            data-name="Ellipse 12"
          />
          <Path
            d="M1129.694 135.594a14 14 0 110 .1z"
            fill="#fff"
            fillRule="evenodd"
            data-name="Ellipse 13"
          />
          <Image
            width={11}
            height={18}
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAYCAYAAAAs7gcTAAAAAXNSR0IArs4c6QAAAK1JREFUOE9jZCABMJKgloGOihsYGlgYFBhYGB4w/GpgaPiH7EwUZ1RKtwkzsv++wMjAIMPAwBDTeq9+KVbFuSq57Hz/RNYyMDB4QxVgV1yj2OD2n4FxOgMjgxKSSdgVVys1nmVgYDBiYGA4B6VBenCYrNR46D8D4wrWe/9m/VZi/I3XGQ0KDRwNDxp+gBRVKzX+x6sY2ccjSXFU67365TjTBqG0Tcf0jM8pg8QZAFMNTxmzvOELAAAAAElFTkSuQmCC"
            data-name={1}
            transform="translate(1138.694 127.694)"
          />
        </G>
        <G data-name="Group 11">
          <Image
            width={71}
            height={17}
            xlinkHref="data:image/png;base64,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"
            data-name="Car Details"
            transform="translate(-742 -61) translate(780.5 244)"
          />
        </G>
        <G data-name="Group 343" transform="translate(-1004 28)">
          <G data-name="Group 33" transform="translate(80.537 -1.463)">
            <Path
              d="M1118.463 130.363a20 20 0 110 .1z"
              fill="#e6e6e6"
              fillRule="evenodd"
              data-name="Ellipse 12"
            />
            <Path
              d="M1124.463 130.363a14 14 0 110 .1z"
              fill="#fff"
              fillRule="evenodd"
              data-name="Ellipse 13"
            />
            <Image
              width={11}
              height={18}
              xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAYCAYAAAAs7gcTAAAAAXNSR0IArs4c6QAAAVVJREFUOE/VkjFLA0EQRr/Z5MDKSiysZCMiChYKFqa1EQs7a8FGsLJRcyZkInfEWPgPLLRNKzZ2oqUoKIoSEwNiYSUKprjcjWSTC8EkRZqAWy0zb4c3s0Po4VAPLPoIMzjK4GonPaPB4zzk+UhDaAXAsABvRHJiVeDyO/+ED4nBqqrpQoB4WzXBsVtKrzZhe4xnKKDreoASgYoeqcDLAlirRTxrYPDgafvbZHdjPE+CDRE1YkWCZS7wl60zSwScGsBX2imnSubeqRFbZw4J2Kzlnov30TzyfkfYjmUWSXDWSOacYnqn6dxaOal5QUDnJiYoWiKz/MqfbXAithdXIpeNxAckMueWkuXWYsY5McoTStFjCPok8f0XLvztx8zZ03QDYNp4EtYFcheCVgW34ceY0UHoqtv2BUqmsgV+qM9Zcw6grW4w+WrSKaeMYh9XtJvOf9X4BRCGdBnRy54uAAAAAElFTkSuQmCC"
              data-name={2}
              transform="translate(1133.463 122.463)"
            />
          </G>
          <Image
            width={76}
            height={17}
            xlinkHref="data:image/png;base64,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"
            data-name="Your Details"
            transform="translate(1181 155)"
          />
        </G>
        <G data-name="Group 344">
          <G data-name="Group 345" transform="translate(-853 28)">
            <G data-name="Group 33" transform="translate(80.537 -1.463)">
              <Path
                d="M1118.463 130.363a20 20 0 110 .1z"
                fill="#e6e6e6"
                fillRule="evenodd"
                data-name="Ellipse 12"
              />
              <Path
                d="M1124.463 130.363a14 14 0 110 .1z"
                fill="#fff"
                fillRule="evenodd"
                data-name="Ellipse 13"
              />
              <Image
                width={11}
                height={18}
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAYCAYAAAAs7gcTAAAAAXNSR0IArs4c6QAAAX9JREFUOE/Nkr8vQ1EUx7/ntSiDkNQiIvo0Rn+ASoTExNBBB0kXwsBgk0jb9J2HvjCYGpFImCWNQUIYTH7MEoNJXzGwGMSAaPqOvCttqt7SRdztfs/nnPM991xCHYfqYPGHcAwxXw65kpc9ZYM7uaXYjHURihLQBeAaGtKZW+OgOknBSd08BDBWW02Accs2jso6LXWz7vNT3hUImPY7clwkugRBB7CfsY2JCsxhbv0UimhA2J+XTQY7Kd28ECAikD3L5skKXN06EeJ+jbAooPh3JxldtfnUE07qbAKUdoMiyFoFY+HXgGUhEVqOg2SAgDmVAGxZtjHvWbkspnRzSoBd997gSDvf8YuylQqv9DolGQZJh2Uba27BpG4MAtq5ShYZyhT4TMEJ3RwjwH1nQEP0Fc8nraVgFoRZxZb8ndZ98knBansBugLQ57HinYxtzPzw7FoRR7YBGSkHhLDR+C5pfuQ3zwG5h9s+fAgGmvDAN/xZ2+kP/7PHkBXpn9j4AmZRfhnfpqjlAAAAAElFTkSuQmCC"
                data-name={3}
                transform="translate(1133.463 122.463)"
              />
            </G>
            <Image
              width={47}
              height={17}
              xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAXCAYAAACbDhZsAAAAAXNSR0IArs4c6QAAA71JREFUWEftVk1oXFUYPd+dMWOqLtJFtJNUq7gVUn8WqV1UxaKLxIqCiqYdSOZ7WRjR+reoP2OrC9GFEoV3v5mRtN1YB6Vg1YrpQsRWEBTaCgqKBjW6cixqzGTm3c+54U2YxHZCmUIIZOAxm3vPPfd855z3CKv4R6uYO9bIr9T0Vr/yo6Oj3QB6mhVU1UqtVvu9WCz+cSGUZeYrAVwkIj9cCDyPMa88M78IYM/ZQInoHVV9SESq7RzKzEcApEXk+nZwmvcuIp9MJjc451y8YJNz7kEAjwB4RkReaudQZr4FwDoR+aAdnHOST6fTiVwu1yCPXC5npqenIwCHROT+eEqBvwyAKwB875zjQqHwWRAEt6nqQWPM9jAMT/u1IyMjVxtjPgeQATBARN3W2vta4TDzgfiS9/p1QRDsVtUnjDE3hWH46/Dw8FWJROKEMWbHIuUTicT6ZDIZ1Wq1RBRFvX4TEe0kojuttUeZeReACQDHAHgbPA6gF8C19XN+A3CGiF6z1j7pD85ms88R0QvJZPKyWq32dsM2rXCI6AFV3Vcul1OlUmmOmb8CsJmIdllrDzDzwwDG5+bmOpf1vKqO9/T0POonwsw/e1IistH/ZzKZizs6Ov4C8JaIBEEQvKeqN4vI5bG6U0R00lo70Oz5VjjGmHHn3CkAt6ZSqeOVSmU2tspBEdnJzJ/Ewd+2lHyGiAwAbwHv9/0i4kfebKG/iejrhvdUtR/AlyKyhZm3A/iYiPqMMbNRFH2rqgP5fP5Ig3w6nb4xtmIrnD+9Rs65o8YYP2ULYLBcLm/s6uryl3lMRN5YRL7Z88wcesv5R0SEmdcB+Mf7PLbNQnbqI/3RWvtynJEz8WEVALvL5fKlpVIpapAHsHU5nGw2u5+IbgDwIYA7iOgpVf2IiO5R1XeNMb3e/+ckH1tiCkB3FEWbisXiFDP/C+A7EelrMGfmvUT0jbX2UBywN1V1EIAP/qSIDMcWWqjK5XCCILhLVQ97oepTPKyqz8cX/qVe6VURueZ/Pb+0beIGmQTwqYhsY+bXfXXWrbVXVX0r+AA/S0SD1tr345D2NWzlnOsvFApfnIV8S5ymKUNVb8/n85PMfBLAdUT0aqMQ5pXPZrP7iMh3ufe7NndpHMK7iWjHzMzMZGdnZxHAfN35dvEWEZGnm/fEgexoBHcp+aGhoUuWw6nn53g9P/2+VSYmJmaDIHglbr8t1toTC8qf70tjbGwsVa1WN4Rh+NP57m1e3y7O6v8wa0e9ldy7pvxKqb+m/Eop/x/VSQTMkQ97HAAAAABJRU5ErkJggg=="
              data-name="Review"
              transform="translate(1195.5 155)"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default StepsIcon;
