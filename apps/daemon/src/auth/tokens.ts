import fs from "fs";
import type { BaseClient, TokenSet as TokenSetType } from "openid-client";
import open from "open";
import { errors, Issuer, TokenSet } from "openid-client";
import prompts from "prompts";

export class OAuthInternalError extends Error {}
export class OAuthDeviceAuthError extends Error {}
export class OAuthRefreshError extends Error {}

const REFRESH_TOKEN_INTERVAL_MS = 1000 * 3600; // Refresh tokens every hour
const promiseSleep = (interval: number) =>
    new Promise<void>((resolve) => setTimeout(() => resolve(), interval));

export class OAuth {
    oAuthDomain: string;
    oAuthAudience: string;
    oAuthClientId: string;
    client: BaseClient;
    tokens?: TokenSetType;
    tokensFilePath: string;

    constructor(
        oAuthDomain: string,
        oAuthAudience: string,
        oAuthClientId: string,
        client: BaseClient,
        tokensFilePath: string,
    ) {
        this.oAuthDomain = oAuthDomain;
        this.oAuthAudience = oAuthAudience;
        this.oAuthClientId = oAuthClientId;
        this.client = client;
        this.tokensFilePath = tokensFilePath;
    }

    async init() {
        this.tokens = OAuth.getTokensFromStore(this.tokensFilePath);
        if (!this.tokens) {
            this.tokens = OAuth.writeTokensToStore(
                this.tokensFilePath,
                await this.authorizeDevice(),
            );
        }
        this.periodicallyRefresh().catch((err) => {
            console.log("Periodic refresh has failed");
            if (err instanceof Error) {
                console.error(err);
            }
            throw new OAuthInternalError("Periodic refresh failed");
        });
    }

    async periodicallyRefresh() {
        await promiseSleep(REFRESH_TOKEN_INTERVAL_MS);
        try {
            await this.refreshTokens();
        } catch (err) {
            console.error(err);
            console.error("Token refresh has failed");
        }

        await this.periodicallyRefresh();
    }

    async refreshTokens(): Promise<void> {
        if (!this.tokens) {
            throw new OAuthInternalError("OAuth was not initialized");
        }

        if (!this.tokens.refresh_token) {
            throw new OAuthRefreshError("OAuth missing refresh token");
        }

        if (!this.tokens.expires_at) {
            throw new OAuthRefreshError(
                "OAuth tokens missing expires_at timestamp",
            );
        }

        const expiresAt = new Date(1000 * this.tokens.expires_at);
        console.log(`Token expires at ${expiresAt.toString()}`);
        const refreshAtDate =
            expiresAt.getTime() - REFRESH_TOKEN_INTERVAL_MS / 2;
        console.log(`Refresh at ${new Date(refreshAtDate).toString()}`);

        if (Date.now() < refreshAtDate) {
            return;
        }

        console.log("Refreshing oAuth tokens");
        const newTokens = await this.client.refresh(this.tokens.refresh_token);
        this.tokens = OAuth.writeTokensToStore(
            this.tokensFilePath,
            new TokenSet({
                ...this.tokens,
                ...newTokens,
            }),
        );
    }

    async authorizeDevice() {
        const handle = await this.client.deviceAuthorization({
            scope: "offline_access openid",
            audience: this.oAuthAudience,
        });

        // Device Authorization Response - https://tools.ietf.org/html/rfc8628#section-3.2
        const { verification_uri_complete, user_code, expires_in } = handle;

        // User Interaction - https://tools.ietf.org/html/rfc8628#section-3.3
        await prompts({
            name: "Prompt for browser",
            type: "invisible",
            message: `Press any key to open up the browser to login or press ctrl-c to abort. You should see the following code: ${user_code}. It expires in ${expires_in % 60 === 0 ? `${expires_in / 60} minutes` : `${expires_in} seconds`}.`,
        });
        // opens the verification_uri_complete URL using the system-register handler for web links (browser)
        open(verification_uri_complete);

        try {
            return await handle.poll();
        } catch (err) {
            if (!(err && typeof err === "object" && "error" in err)) {
                throw new OAuthDeviceAuthError("Unknown error occurred");
            }

            switch (err.error) {
                case "access_denied":
                    throw new OAuthDeviceAuthError(
                        "User cancelled interaction",
                    );
                case "expired_token":
                    throw new OAuthDeviceAuthError("Device flow expired");
                default:
                    if (err instanceof errors.OPError) {
                        throw new OAuthDeviceAuthError(
                            `Error = ${err.error}; error_description = ${err.error_description}`,
                        );
                    }
            }

            throw new OAuthDeviceAuthError("Unknown error occurred");
        }
    }

    static writeTokensToStore(tokensFilePath: string, tokens: TokenSetType) {
        console.log("Writing new tokens to store");
        fs.writeFileSync(tokensFilePath, JSON.stringify(tokens), "utf-8");
        return OAuth.getTokensFromStore(tokensFilePath);
    }

    static getTokensFromStore(
        tokensFilePath: string,
    ): TokenSetType | undefined {
        if (!fs.existsSync(tokensFilePath)) {
            return;
        }
        const tokensJSON = fs.readFileSync(tokensFilePath, "utf-8");
        if (tokensJSON) {
            const tokenSet = JSON.parse(tokensJSON) as TokenSetType;
            return new TokenSet(tokenSet);
        }
    }

    static async create(
        oAuthDomain: string,
        oAuthAudience: string,
        oAuthClientId: string,
        tokensFilePath: string,
    ) {
        const issuer = await Issuer.discover(`https://${oAuthDomain}`);

        const client = new issuer.Client({
            client_id: oAuthClientId,
            token_endpoint_auth_method: "none",
            id_token_signed_response_alg: "RS256",
        });

        const oAuth = new OAuth(
            oAuthDomain,
            oAuthAudience,
            oAuthClientId,
            client,
            tokensFilePath,
        );
        await oAuth.init();
        return oAuth;
    }

    async getAccessToken() {
        if (!this.tokens?.access_token) {
            throw new OAuthInternalError("No access token found");
        }
        // Check if token is expired and refresh if necessary
        if (
            this.tokens.expires_at &&
            this.tokens.expires_at < Date.now() / 1000
        ) {
            await this.refreshTokens();
        }
        return this.tokens.access_token;
    }
}
