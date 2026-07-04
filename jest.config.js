module.exports = {
    preset: '@react-native/jest-preset',
    moduleNameMapper: {
        '^@domain/(.*)$': '<rootDir>/src/domain/$1',
        '^@application/(.*)$': '<rootDir>/src/application/$1',
        '^@adapters/(.*)$': '<rootDir>/src/adapters/$1',
        '^@infra/(.*)$': '<rootDir>/src/infrastructure/$1',
        '^@src/(.*)$': '<rootDir>/src/$1'
    },
    collectCoverage: false,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/index.ts',
        '!src/**/types/**',
        '!src/**/generated/**',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
