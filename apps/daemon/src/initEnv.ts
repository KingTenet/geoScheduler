import { config } from "dotenv";

config();

function assertEnvExists<
    E extends Record<string, string | undefined>,
    K extends keyof E,
>(envvars: E, required: string | K): string {
    if (required in envvars) {
        const value = envvars[required as K];
        if (value) {
            return value;
        }
    }

    throw new Error(`Missing required env var: ${required.toString()}`);
}

const REQUIRED_VARS = [
    "API_BASE_URL",
    "AUTH0_DOMAIN",
    "AUTH0_AUDIENCE",
    "AUTH0_CLIENT_ID",
    "TOKENS_FILE_PATH",
] as const;

type RequiredKey = (typeof REQUIRED_VARS)[number];

export default function getEnv(): Record<RequiredKey, string> {
    const env = REQUIRED_VARS.reduce(
        (acc, name) => ({
            ...acc,
            [name]: assertEnvExists(process.env, name),
        }),
        {},
    );
    return env as Record<RequiredKey, string>;
}
