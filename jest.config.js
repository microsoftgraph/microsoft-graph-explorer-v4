const esModules = ['@ms-ofb', 'ngx-bootstrap', 'lodash-es', '@fluentui'].join(
  '|'
);
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!build/**',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/app/middleware/telemetryMiddleware.ts',
    '!src/telemetry/telemetry.ts'
  ],
  resolver: `${__dirname}/src/tests/common/resolver.js`,
  setupFiles: ['react-app-polyfill/jsdom'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', {
      isolatedModules: true
    }],
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': ['ts-jest', {
      isolatedModules: true
    }],
    [`(${esModules}).+\\.js$`]: ['ts-jest', {
      isolatedModules: true
    }]
  },
  transformIgnorePatterns: [
    '^.+\\.module\\.(css|sass|scss)$',
    '/node_modules/(?!@fluentui)',
    '/node_modules/'
  ],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|less|scss)$': '<rootDir>/config/CSSStub.ts'
  },
  moduleFileExtensions: [
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
    'node'
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  testResultsProcessor: 'jest-sonar-reporter'
};
