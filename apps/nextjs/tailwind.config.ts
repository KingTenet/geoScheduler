import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

import baseConfig from "@GeoScheduler/tailwind-config/web";

export default {
    content: [...baseConfig.content, "./src/**/*.tsx"],
    presets: [baseConfig],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-geist-sans)", ...fontFamily.sans],
                mono: ["var(--font-geist-mono)", ...fontFamily.mono],
            },
        },
    },
    plugins: [],
} satisfies Config;
