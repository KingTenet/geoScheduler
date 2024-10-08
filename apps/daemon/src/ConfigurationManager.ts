import dotenv from "dotenv";

import type { ActionExecutionConfig } from "./types/interfaces";

dotenv.config();

export class ConfigurationManager {
    getSyncInterval(): number {
        return parseInt(process.env.SYNC_INTERVAL || "60000", 10);
    }

    getDefaultExecutionConfig(): ActionExecutionConfig {
        return {
            script: process.env.DEFAULT_SCRIPT || "node",
            args: (process.env.DEFAULT_ARGS || "").split(" ").filter(Boolean),
        };
    }

    getActionTypeConfig(actionType: string): Partial<ActionExecutionConfig> {
        const script =
            process.env[`ACTION_TYPE_${actionType.toUpperCase()}_SCRIPT`];
        const args =
            process.env[`ACTION_TYPE_${actionType.toUpperCase()}_ARGS`];

        return {
            script: script || undefined,
            args: args ? args.split(" ").filter(Boolean) : undefined,
        };
    }

    getLogLevel(): string {
        return process.env.LOG_LEVEL || "info";
    }

    getErrorLogPath(): string {
        return process.env.ERROR_LOG_PATH || "logs/error.log";
    }

    getCombinedLogPath(): string {
        return process.env.COMBINED_LOG_PATH || "logs/combined.log";
    }

    getApiBaseUrl(): string {
        const apiBaseUrl = process.env.API_BASE_URL;
        if (!apiBaseUrl) {
            throw new Error("API_BASE_URL is not set in environment variables");
        }
        return apiBaseUrl;
    }

    getAuthDomain(): string {
        const authDomain = process.env.AUTH0_DOMAIN;
        if (!authDomain) {
            throw new Error("AUTH0_DOMAIN is not set in environment variables");
        }
        return authDomain;
    }

    getAuthAudience(): string {
        const authAudience = process.env.AUTH0_AUDIENCE;
        if (!authAudience) {
            throw new Error(
                "AUTH0_AUDIENCE is not set in environment variables",
            );
        }
        return authAudience;
    }

    getAuthClientId(): string {
        const authClientId = process.env.AUTH0_CLIENT_ID;
        if (!authClientId) {
            throw new Error(
                "AUTH0_CLIENT_ID is not set in environment variables",
            );
        }
        return authClientId;
    }

    getTokensFilePath(): string {
        const tokensFilePath = process.env.TOKENS_FILE_PATH;
        if (!tokensFilePath) {
            throw new Error(
                "TOKENS_FILE_PATH is not set in environment variables",
            );
        }
        return tokensFilePath;
    }
}
