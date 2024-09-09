import type { JWTPayload } from "jose";
import { createRemoteJWKSet, jwtVerify } from "jose";

const AUTH0_ISSUER_BASE_URL = process.env.AUTH0_ISSUER_BASE_URL;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;

const JWKS = AUTH0_ISSUER_BASE_URL
    ? createRemoteJWKSet(
          new URL(`${AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`),
      )
    : undefined;

export async function verify(jwt: string | Uint8Array): Promise<JWTPayload> {
    if (!JWKS) {
        throw new Error();
    }
    const { payload } = await jwtVerify(jwt, JWKS, {
        issuer: `${AUTH0_ISSUER_BASE_URL}/`,
        audience: AUTH0_AUDIENCE,
    });

    return payload;
}
