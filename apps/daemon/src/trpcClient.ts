// src/trpcClient.ts
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@GeoScheduler/api";

export const getTRPCClient = (url: string) => {
    return createTRPCClient<AppRouter>({
        links: [
            httpBatchLink({
                url,
                transformer: superjson,
            }),
        ],
    });
};
