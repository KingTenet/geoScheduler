import baseConfig from "@GeoScheduler/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
    {
        ignores: ["dist/**"],
    },
    ...baseConfig,
];
