/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    // preset: "ts-jest",
    testEnvironment: "node",
    roots: [
        "<rootDir>/src",
        "<rootDir>/tests",
        // "node_modules/@GeoScheduler/api/src/",
    ],
    testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
    // setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    // globalTeardown: "<rootDir>/tests/teardown.ts",

    // https://stackoverflow.com/a/73816302/1802356
    transform: {
        "\\.[jt]sx?$": [
            "ts-jest",

            {
                tsconfig: "<rootDir>/tsconfig.tests.json",
                // https://github.com/kulshekhar/ts-jest/issues/1343
                isolatedModules: true,
            },
        ],
    },
    // moduleNameMapper: {
    //     "(.+)\\.js": "$1",
    // },
    // extensionsToTreatAsEsm: [".ts"],

    //---------------
    preset: "ts-jest/presets/js-with-ts",
    transformIgnorePatterns: [
        "node_modules/.pnpm/superjson@2.2.1/node_modules/(?!superjson/.*)",
    ],
};
