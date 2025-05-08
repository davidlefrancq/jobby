module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // permet de résoudre les alias @/ vers src/
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
};
