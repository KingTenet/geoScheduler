import { TRPCClientError } from "@trpc/client";

import type { OAuth } from "../auth/tokens";
import { getTRPCClient } from "../trpcClient";

export default class ApiClient {
    auth: OAuth;
    trpcClient: ReturnType<typeof getTRPCClient>;

    constructor(apiBaseUrl: string, auth: OAuth) {
        this.auth = auth;
        this.trpcClient = getTRPCClient(apiBaseUrl, auth);
    }

    // private async getHeaders() {
    //     return {
    //         Authorization: `Bearer ${await this.auth.getAccessToken()}`,
    //     };
    // }

    async getGeoSchedules() {
        try {
            const geoSchedules =
                await this.trpcClient.geoSchedules.getAll.query();

            return geoSchedules;
            // return await this.trpcClient.geoSchedules.getAll.query();
        } catch (err) {
            if (err instanceof TRPCClientError) {
                console.log(err);
                console.log("It is a TRPC Error!!!");
            }
            console.error("Failed to fetch geo schedules:", err);
            throw err;
        }
    }

    async getActions() {
        try {
            const actions = await this.trpcClient.actions.getAll.query();

            return actions;
            // return await this.trpcClient.geoSchedules.getAll.query();
        } catch (err) {
            if (err instanceof TRPCClientError) {
                console.log(err);
                console.log("It is a TRPC Error!!!");
            }
            console.error("Failed to fetch actions:", err);
            throw err;
        }
    }
}
