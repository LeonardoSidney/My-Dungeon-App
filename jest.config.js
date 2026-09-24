module.exports = {
    preset: '@react-native/jest-preset',
    moduleNameMapper: {
        '^@domain/(.*)$': '<rootDir>/src/domain/$1',
        '^@application/(.*)$': '<rootDir>/src/application/$1',
        '^@adapters/(.*)$': '<rootDir>/src/adapters/$1',
        '^@composition/(.*)$': '<rootDir>/src/composition/$1',
        '^@infra/(.*)$': '<rootDir>/src/infrastructure/$1',
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@test/helpers$': '<rootDir>/__helpers__',
        '^@test/helpers/(.*)$': '<rootDir>/__helpers__/$1'
    },
    collectCoverage: false,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/index.ts',
        '!src/**/types/**',
        '!src/**/generated/**',
        '!src/**/*.web.{ts,tsx}',
        '!src/**/ui/**',
        '!src/**/styles.ts',
        '!src/**/constants.ts',
        '!src/**/navigation/**',
        '!src/App.tsx',
        '!src/migration.ts',
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

