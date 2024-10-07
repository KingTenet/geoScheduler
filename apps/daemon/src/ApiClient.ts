import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@GeoScheduler/api";

import type { OAuth } from "./auth/tokens";
import type { ConfigurationManager } from "./ConfigurationManager";
import type { Logger } from "./Logger";
import type { DaemonAction } from "./types/actions";
import { transformActionToDaemonAction } from "./transformers/actions";

export class ApiClient {
    private trpcClient: ReturnType<typeof createTRPCClient<AppRouter>>;

    constructor(
        private config: ConfigurationManager,
        private auth: OAuth,
        private logger: Logger,
    ) {
        this.trpcClient = createTRPCClient<AppRouter>({
            links: [
                httpBatchLink({
                    url: this.config.getApiBaseUrl(),
                    transformer: superjson,
                    headers: async () => {
                        const token = await this.auth.getAccessToken();
                        return {
                            Authorization: `Bearer ${token}`,
                        };
                    },
                }),
            ],
        });
    }

    async getActions(): Promise<[DaemonAction, boolean][]> {
        try {
            this.logger.info("Fetching actions from API");
            const actions = await this.trpcClient.actions.getAll.query();
            this.logger.info(`Fetched ${actions.length} actions from API`);

            return actions.map((action) => [
                transformActionToDaemonAction(action),
                action.shouldBeExecuted,
            ]);
        } catch (error) {
            this.logger.error("Failed to fetch actions from API", error);
            throw error;
        }
    }
}
