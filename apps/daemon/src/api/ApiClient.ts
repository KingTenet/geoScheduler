import { TRPCClientError } from "@trpc/client";

import type { OAuth } from "../auth/tokens";
import type { DaemonActionShouldBeExecuted } from "../types/actions";
import { transformActionToDaemonAction } from "../transformers/actions";
import { getTRPCClient } from "../trpcClient";

export default class ApiClient {
    auth: OAuth;
    trpcClient: ReturnType<typeof getTRPCClient>;

    constructor(apiBaseUrl: string, auth: OAuth) {
        this.auth = auth;
        this.trpcClient = getTRPCClient(apiBaseUrl, auth);
    }

    async getActions(): Promise<DaemonActionShouldBeExecuted[]> {
        try {
            const actions = await this.trpcClient.actions.getAll.query();
            return actions.map((action) => [
                transformActionToDaemonAction(action),
                action.shouldBeExecuted,
            ]);
        } catch (err) {
            if (err instanceof TRPCClientError) {
                console.log(err);
            }
            console.error("Failed to fetch actions:", err);
            throw err;
        }
    }
}
