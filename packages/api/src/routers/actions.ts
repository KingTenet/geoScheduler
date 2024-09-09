import { z } from "zod";

import type { PrismaClient } from "@GeoScheduler/db";
import { allActionPayloadSchema } from "@GeoScheduler/validators";

import type { ActionPayload } from "../transformers/actions";
import {
    createActionsFromGeoScheduleConfig,
    transformActionFromDB,
} from "../transformers/actions";
import { authedProcedure, createTRPCRouter } from "../trpc";

async function getAllActions(primsaClient: PrismaClient, userId: string) {
    const geoSchedules = await primsaClient.geoScheduleConfig.findMany({
        where: {
            userId: userId,
        },
        include: {
            appsToBlock: {
                include: {
                    apps: true,
                },
            },
            geometryCriteria: {
                include: {
                    place: true,
                },
            },
            dailyRecurrence: true,
            weeklyRecurrence: true,
        },
    });

    const newActions = geoSchedules.flatMap(createActionsFromGeoScheduleConfig);

    await primsaClient.actions.createMany({
        data: newActions,
    });

    const actions = await primsaClient.actions.findMany({
        where: {
            geoScheduleConfig: {
                userId: userId,
            },
        },
        include: {
            geoScheduleConfig: {
                include: {
                    appsToBlock: {
                        include: {
                            apps: true,
                        },
                    },
                },
            },
        },
    });

    const mappedActions: ActionPayload[] = actions.map(transformActionFromDB);
    return mappedActions;
}

export const actionsRouter = createTRPCRouter({
    getAll: authedProcedure
        .output(allActionPayloadSchema)
        .query(async ({ ctx }) => {
            return getAllActions(ctx.db, ctx.user.id);
        }),

    byId: authedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const action = await ctx.db.actions.findUnique({
                where: { id: input.id },
                include: {
                    geoScheduleConfig: {
                        include: {
                            appsToBlock: {
                                include: {
                                    apps: true,
                                },
                            },
                        },
                    },
                },
            });
            return action;
        }),
});
