import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@GeoScheduler/api";

import { env } from "~/env";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (
    req: NextRequest,
    accessToken: string | undefined,
) => {
    return createTRPCContext({
        headers: req.headers,
        auth: { accessToken },
    });
};

const handler = async (req: NextRequest) => {
    const res = NextResponse.next();

    const { accessToken } = await getAccessToken(req, res).catch(() => ({
        accessToken: undefined,
    }));

    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: () => createContext(req, accessToken),
        onError:
            env.NODE_ENV === "development"
                ? ({ path, error }) => {
                      console.error(
                          `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
                      );
                  }
                : undefined,
    });
};
export { handler as GET, handler as POST };
