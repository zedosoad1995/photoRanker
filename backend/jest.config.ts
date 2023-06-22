export default {
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  globalSetup: "<rootDir>/src/tests/setup.ts",
  globalTeardown: "<rootDir>/src/tests/teardown.ts",
};
