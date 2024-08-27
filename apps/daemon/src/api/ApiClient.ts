import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";

import { RouterInputs, RouterOutputs } from "@GeoScheduler/api";
import {
    byIdGeoSchedulePayloadSchema,
    createGeoSchedulePayloadSchema,
} from "@GeoScheduler/validators";

import type { OAuth } from "../auth/tokens";
import { getTRPCClient } from "../trpcClient";

export default class ApiClient {
    auth: OAuth;
    trpcClient: ReturnType<typeof getTRPCClient>;

    constructor(apiBaseUrl: string, auth: OAuth) {
        this.auth = auth;
        this.trpcClient = getTRPCClient(apiBaseUrl);
    }

    // private async getHeaders() {
    //     return {
    //         Authorization: `Bearer ${await this.auth.getAccessToken()}`,
    //     };
    // }

    async getGeoScheduleById(id: string) {
        try {
            const { data: validPayload } =
                byIdGeoSchedulePayloadSchema.safeParse({
                    id,
                });

            if (!validPayload) {
                throw new Error("");
            }

            // You can await this here if you don't want to show Suspense fallback below

            const geoSchedule =
                await this.trpcClient.geoSchedules.byId.query(validPayload);

            return await this.trpcClient.geoSchedules.all.query();
        } catch (err) {
            if (err instanceof TRPCClientError) {
                console.log(err);
                console.log("It is a TRPC Error!!!");
            }
            console.error("Failed to fetch geo schedules:", err);
            throw err;
        }
    }

    async createGeoSchedule(data: RouterInputs["geoSchedules"]["create"]) {
        try {
            const { data: validPayload } =
                createGeoSchedulePayloadSchema.safeParse({
                    id: data,
                });

            return await this.trpcClient.geoSchedules.create.mutate(
                validPayload as RouterInputs["geoSchedules"]["create"],
            );
        } catch (err) {
            console.error("Failed to create geo schedule:", err);
            throw err;
        }
    }

    // Add more methods as needed for other API endpoints
}
