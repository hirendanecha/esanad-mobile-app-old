module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-worklets/plugin',
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
          '@api': './src/api',
          '@assets': './src/assets',
          '@icons': './src/assets/icons',
          '@images': './src/assets/images',
          '@components': './src/components',
          '@config': './src/config',
          '@constants': './src/constants',
          '@hooks': './src/hooks',
          '@i18n': './src/i18n',
          '@navigation': './src/navigation',
          '@provider': './src/provider',
          '@screens': './src/screens',
          '@store': './src/store',
          '@theme': './src/theme',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
