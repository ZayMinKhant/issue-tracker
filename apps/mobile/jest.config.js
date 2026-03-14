module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^@issue-tracker/types$': '<rootDir>/../../packages/types/src/index.ts',
    '^@issue-tracker/utils$': '<rootDir>/../../packages/utils/src/index.ts',
  },
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  transformIgnorePatterns: [
    'node_modules/(?!.pnpm|((jest-)?react-native|@react-native(-community)?|react-native-select-dropdown)/)',
  ],
};
