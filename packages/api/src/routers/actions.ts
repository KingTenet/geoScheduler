import { z } from "zod";

import { allActionPayloadSchema } from "@GeoScheduler/validators";

import type { ActionPayload } from "../transformers/actions";
import {
    createActionsFromGeoScheduleConfig,
    transformActionFromDB,
} from "../transformers/actions";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const actionsRouter = createTRPCRouter({
    getAll: publicProcedure
        .output(allActionPayloadSchema)
        .query(async ({ ctx }) => {
            const geoSchedules = await ctx.db.geoScheduleConfig.findMany({
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

            const newActions = geoSchedules.flatMap(
                createActionsFromGeoScheduleConfig,
            );

            await ctx.db.actions.createMany({
                data: newActions,
            });

            const actions = await ctx.db.actions.findMany({
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

            const mappedActions: ActionPayload[] = actions.map(
                transformActionFromDB,
            );
            return mappedActions;
        }),

    byId: publicProcedure
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
