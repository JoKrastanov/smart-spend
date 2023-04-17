module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['<rootDir>/build/'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    }
  };
  