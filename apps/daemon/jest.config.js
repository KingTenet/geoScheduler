// /** @type {import('ts-jest').JestConfigWithTsJest} **/
// export default {
//     testEnvironment: "node",
//     transform: {
//         "\\.[jt]sx?$": [
//             "ts-jest",
//             { tsconfig: "<rootDir>/tsconfig.tests.json" },
//         ],
//     },
//     transformIgnorePatterns: [
//         "node_modules/.pnpm/superjson@2.2.1/node_modules/(?!superjson/.*)",
//     ],

//     preset: "ts-jest/presets/js-with-ts",
//     // setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
//     // globalTeardown: "<rootDir>/tests/teardown.ts",
// };

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    // preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src", "<rootDir>/tests"],
    testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
    // setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    // globalTeardown: "<rootDir>/tests/teardown.ts",

    // https://stackoverflow.com/a/73816302/1802356
    transform: {
        "\\.[jt]sx?$": [
            "ts-jest",
            { tsconfig: "<rootDir>/tsconfig.tests.json" },
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
        // "node_modules/(?!@GeoScheduler/api/.*)",
        "node_modules/@GeoScheduler/api",
    ],
};
