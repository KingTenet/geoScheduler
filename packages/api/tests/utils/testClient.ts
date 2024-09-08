import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "../../src/root";

export const createTestClient = (url: string) => {
    return createTRPCClient<AppRouter>({
        links: [
            httpBatchLink({
                url,
                transformer: superjson,
            }),
        ],
    });
};
