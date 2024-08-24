import baseConfig, {
    restrictEnvAccess,
} from "@GeoScheduler/eslint-config/base";
import nextjsConfig from "@GeoScheduler/eslint-config/nextjs";
import reactConfig from "@GeoScheduler/eslint-config/react";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
    {
        ignores: [".next/**"],
    },
    ...baseConfig,
    ...reactConfig,
    ...nextjsConfig,
    ...restrictEnvAccess,
    {
        rules: {
            // "@typescript-eslint/no-unsafe-assignment": ["off"],
            // "@typescript-eslint/no-unused-vars": ["off"],
        },
    },
];
