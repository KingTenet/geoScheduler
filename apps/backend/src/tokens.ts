import fs from "fs";
import open from "open";
import { BaseClient, errors, Issuer, TokenSet } from "openid-client";
import prompts from "prompts";

export class OAuthInternalError extends Error {}
export class OAuthDeviceAuthError extends Error {}
export class OAuthRefreshError extends Error {}
const TOKENS_FILE_PATH = ".tokens";

const REFRESH_TOKEN_INTERVAL_MS = 1000 * 3600; // Refresh tokens every hour
const promiseSleep = (interval: number) =>
    new Promise<void>((resolve) => setTimeout(() => resolve(), interval));

export class OAuth {
    oAuthDomain: string;
    oAuthAudience: string;
    oAuthClientId: string;
    client: BaseClient;
    tokens?: TokenSet;

    constructor(
        oAuthDomain: string,
        oAuthAudience: string,
        oAuthClientId: string,
        client: BaseClient,
    ) {
        this.oAuthDomain = oAuthDomain;
        this.oAuthAudience = oAuthAudience;
        this.oAuthClientId = oAuthClientId;
        this.client = client;
    }

    async init() {
        this.tokens = OAuth.getTokensFromStore();
        if (!this.tokens) {
            this.tokens = OAuth.writeTokensToStore(
                await this.authorizeDevice(),
            );
        }

        this.handleTokenRefresh();
    }

    async handleTokenRefresh() {
        if (!this.tokens) {
            throw new OAuthInternalError("OAuth was not initialized");
        }

        if (!this.tokens?.refresh_token) {
            throw new OAuthRefreshError("OAuth missing refresh token");
        }

        if (!this.tokens?.expires_at) {
            throw new OAuthRefreshError(
                "OAuth tokens missing expires_at timestamp",
            );
        }

        const expiresAt = new Date(1000 * this.tokens.expires_at);
        console.log("Token expires at " + expiresAt);
        const refreshAtDate =
            expiresAt.getTime() - REFRESH_TOKEN_INTERVAL_MS / 2;
        console.log("Refresh at " + new Date(refreshAtDate));

        if (Date.now() > refreshAtDate) {
            await this.refreshTokens();
        }

        await promiseSleep(REFRESH_TOKEN_INTERVAL_MS);
        await this.handleTokenRefresh();
    }

    async refreshTokens(): Promise<void> {
        if (!this.tokens?.refresh_token) {
            return;
        }
        console.log("Refreshing oAuth tokens");
        const newTokens = await this.client.refresh(this.tokens.refresh_token);
        this.tokens = OAuth.writeTokensToStore(
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
            if (!err || typeof err !== "object" || !("error" in err)) {
                throw new OAuthDeviceAuthError("Unknown error occurred");
            }
            switch (err.error) {
                case "access_denied": // end-user declined the device confirmation prompt, consent or rules failed
                    console.error("\n\ncancelled interaction");
                    break;
                case "expired_token": // end-user did not complete the interaction in time
                    console.error("\n\ndevice flow expired");
                    break;
                default:
                    if (err instanceof errors.OPError) {
                        console.error(
                            `\n\nerror = ${err.error}; error_description = ${err.error_description}`,
                        );
                    } else {
                        throw err;
                    }
            }
            throw new OAuthDeviceAuthError();
        }
    }

    static writeTokensToStore(tokens: TokenSet) {
        console.log("Writing new tokens to store");
        fs.writeFileSync(TOKENS_FILE_PATH, JSON.stringify(tokens), "utf-8");
        return OAuth.getTokensFromStore();
    }

    static getTokensFromStore(): TokenSet | undefined {
        if (!fs.existsSync(TOKENS_FILE_PATH)) {
            return;
        }
        const tokensJSON = fs.readFileSync(TOKENS_FILE_PATH, "utf-8");
        if (tokensJSON) {
            return new TokenSet(JSON.parse(tokensJSON));
        }
    }

    static async create(
        oAuthDomain: string,
        oAuthAudience: string,
        oAuthClientId: string,
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
        );
        await oAuth.init();
        return oAuth;
    }

    getAccessToken() {
        if (!this.tokens?.access_token) {
            throw new OAuthInternalError("No access token found");
        }
        return this.tokens.access_token;
    }
}
