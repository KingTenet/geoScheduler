import { z } from "zod";

import type { PrismaClient } from "@GeoScheduler/db";
import { allActionPayloadSchema } from "@GeoScheduler/validators";

import type { PrismaAction } from "../prismaQueries/actions";
import type { ActionPayload } from "../transformers/actions";
import { prismaActionQuery } from "../prismaQueries/actions";
import { prismaGeoScheduleQuery } from "../prismaQueries/geoSchedule";
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
        ...prismaGeoScheduleQuery,
    });

    const oldActions: PrismaAction[] = geoSchedules.flatMap(
        ({ actions }): PrismaAction[] => actions,
    );

    const allActions = geoSchedules.flatMap((geoSchedule) =>
        createActionsFromGeoScheduleConfig(geoSchedule),
    );

    const newActions = allActions.filter(
        (maybeNewAction) =>
            !oldActions.find(
                (oldAction) =>
                    oldAction.fromDate.getTime() ===
                        maybeNewAction.fromDate.getTime() &&
                    oldAction.geoScheduleConfigId ===
                        maybeNewAction.geoScheduleConfigId,
            ),
    );

    await primsaClient.actions.createMany({
        data: newActions,
    });

    const actions = await primsaClient.actions.findMany({
        where: {
            geoScheduleConfig: {
                userId: userId,
            },
        },
        ...prismaActionQuery,
    });

    const mappedActions: ActionPayload[] = actions.map(transformActionFromDB);
    return mappedActions;
}

/***
 * prisma.$transaction([
  prisma.posts.deleteMany({ where: { userId: 1 } }),
  prisma.posts.createMany({
    { id: 1, title: 'first',  userId: 1 },
    { id: 2, title: 'second', userId: 1 },
    { id: 3, title: 'third',  userId: 1 },
  }),
]);
 */

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
                ...prismaActionQuery,
            });
            return action;
        }),
});
