// src/trpcClient.ts
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@GeoScheduler/api";

import type { OAuth } from "./auth/tokens";

export const getTRPCClient = (url: string, auth: OAuth) => {
    return createTRPCClient<AppRouter>({
        links: [
            httpBatchLink({
                url,
                transformer: superjson,
                headers: async () => {
                    const token = await auth.getAccessToken();
                    return {
                        Authorization: `Bearer ${token}`,
                    };
                },
            }),
        ],
    });
};
