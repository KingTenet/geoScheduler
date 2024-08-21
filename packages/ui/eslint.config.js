import baseConfig from "@GeoScheduler/eslint-config/base";
import reactConfig from "@GeoScheduler/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
