import { z } from "zod";

import { allActionPayloadSchema } from "@GeoScheduler/validators";

import type { ActionPayload } from "../transformers/actions";
import {
    createActionsFromGeoScheduleConfig,
    transformActionFromDB,
} from "../transformers/actions";
import { authedProcedure, createTRPCRouter } from "../trpc";

function upsertManyActions(ctx, newActions) {
/**
            geoScheduleConfigId: geoScheduleConfigId,
            fromDate: dateFrom,
            toDate: dateTo,
            deletionDateThreshold: deletionDateThreshold,
*/
// geoScheduleConfigId, fromDate


    const groupedActions = Map.groupBy(newActions);
    // await ctx.db.actions.findMany({
        
    // })

    // await ctx.db.actions.createMany({
    //     data: newActions,
    // });
}


export const actionsRouter = createTRPCRouter({
    getAll: authedProcedure
        .output(allActionPayloadSchema)
        .query(async ({ ctx }) => {
            const geoSchedules = await ctx.db.geoScheduleConfig.findMany({
                where: {
                    userId: ctx.user.id,
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

            const newActions = geoSchedules.flatMap(
                createActionsFromGeoScheduleConfig,
            );


           /**
            * {
                where: {
                    id: ctx.user.id,
                },
                update: {},
                create: {
                    id: ctx.user.id,
                },
            } */ 


            await ctx.db.actions.createMany({
                data: newActions,
            });

            const actions = await ctx.db.actions.findMany({
                where: {
                    geoScheduleConfig: {
                        userId: ctx.user.id,
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

            const mappedActions: ActionPayload[] = actions.map(
                transformActionFromDB,
            );
            return mappedActions;
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
