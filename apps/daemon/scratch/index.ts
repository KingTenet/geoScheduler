import { config } from "dotenv";

config();

function pickRequiredEnvVars<
    EnvVars extends Record<string, string>,
    E extends EnvVars,
    K extends keyof E,
>(envvars: E, required: (string | K)[]): Pick<E, K> {
    const result = {} as Pick<E, K>;

    required.forEach((key) => {
        if (key in envvars) {
            const validKey = key as K;
            result[validKey] = envvars[validKey];
        } else {
            throw new Error(`Missing required env var: ${key.toString()}`);
        }
    });

    return result;
}

const env = {
    NODE_ENV: "production",
    PORT: "3000",
    DB_HOST: "localhost",
};

const requiredEnvVars = pickRequiredEnvVars(env, ["DB_HOST", "API_KEY"]);

console.log(requiredEnvVars);
