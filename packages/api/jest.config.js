/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
    testEnvironment: "node",
    transform: {
        "\\.[jt]sx?$": [
            "ts-jest",
            { tsconfig: "<rootDir>/tsconfig.tests.json" },
        ],
    },
    transformIgnorePatterns: [
        "node_modules/.pnpm/superjson@2.2.1/node_modules/(?!superjson/.*)",
    ],

    preset: "ts-jest/presets/js-with-ts",
    // setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    // globalTeardown: "<rootDir>/tests/teardown.ts",

    // transform: {
    //     "^.+.tsx?$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.tests.json" }],
    // },
};
