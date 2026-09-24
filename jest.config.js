module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|@react-navigation|@react-native-async-storage/async-storage)/'
  ],
};
