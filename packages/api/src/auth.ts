import type { JWTPayload } from "jose";
import { createRemoteJWKSet, jwtVerify } from "jose";

const AUTH0_ISSUER_BASE_URL = process.env.AUTH0_ISSUER_BASE_URL;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;

const JWKS = createRemoteJWKSet(
    new URL(`${AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`),
);

export async function verify(jwt: string | Uint8Array): Promise<JWTPayload> {
    const { payload } = await jwtVerify(jwt, JWKS, {
        issuer: `${AUTH0_ISSUER_BASE_URL}/`,
        audience: AUTH0_AUDIENCE,
    });

    return payload;
}
