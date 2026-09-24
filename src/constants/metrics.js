import React from 'react';
import { Dimensions, View, PixelRatio } from 'react-native';
const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 430;
const guidelineBaseHeight = 932;

const scale = size =>
  Math.round(PixelRatio.roundToNearestPixel(width / guidelineBaseWidth) * size);

const verticalScale = size =>
  Math.round(
    PixelRatio.roundToNearestPixel((height / guidelineBaseHeight) * size),
  );

const fontScale = size =>
  Math.round(
    PixelRatio.roundToNearestPixel((height / guidelineBaseHeight) * size),
  );

const moderateScale = size =>
  Math.round(
    PixelRatio.roundToNearestPixel((height / guidelineBaseHeight) * size),
  );

export const inputSize = {
  size:
    height <= 480
      ? 1
      : height > 480 && height <= 600
      ? 2
      : height > 600 && height <= 840
      ? 3
      : 4,
};

export { scale, verticalScale, moderateScale, fontScale };
