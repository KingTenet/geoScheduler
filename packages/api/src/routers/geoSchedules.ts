import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Prisma } from "@GeoScheduler/db";
import {
    actuallyCreateGeoSchedulePayloadSchema,
    createGeoSchedulePayloadSchema,
} from "@GeoScheduler/validators";

import type { PrismaGeoSchedule } from "../prismaQueries/geoSchedule";
import { prismaGeoScheduleQuery } from "../prismaQueries/geoSchedule";
import { transformGeoScheduleFromDB } from "../transformers/geoSchedule";
import { authedProcedure, createTRPCRouter } from "../trpc";

export const geoSchedulesRouter = createTRPCRouter({
    getAll: authedProcedure.query(async ({ ctx }) => {
        const geoSchedules: PrismaGeoSchedule[] =
            await ctx.db.geoScheduleConfig.findMany({
                where: {
                    userId: ctx.user.id,
                },
                ...prismaGeoScheduleQuery,
            });
        return geoSchedules.map(transformGeoScheduleFromDB);
    }),

    byId: authedProcedure
        .input(z.object({ id: z.string() }))
        .output(createGeoSchedulePayloadSchema)
        .query(async ({ ctx, input }) => {
            const geoSchedule: PrismaGeoSchedule | null =
                await ctx.db.geoScheduleConfig.findUnique({
                    where: {
                        id: input.id,
                        userId: ctx.user.id,
                    },
                    ...prismaGeoScheduleQuery,
                });
            if (!geoSchedule) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `${input.id} could not be found in prisma schema geoScheduleConfig`,
                });
            }
            return transformGeoScheduleFromDB(geoSchedule);
        }),

    delete: authedProcedure.input(z.string()).mutation(({ ctx, input }) => {
        return ctx.db.geoScheduleConfig.delete({
            where: {
                id: input,
                userId: ctx.user.id,
            },
        });
    }),

    create: authedProcedure
        .input(actuallyCreateGeoSchedulePayloadSchema)
        .mutation(async ({ ctx, input }) => {
            await ctx.db.user.upsert({
                where: {
                    id: ctx.user.id,
                },
                update: {},
                create: {
                    id: ctx.user.id,
                },
            });

            const place = await ctx.db.place.create({
                data: {
                    name: "Edinburgh" + `${Math.random()}`.slice(0, 5),
                    userId: ctx.user.id,
                    latitude: input.untilLocation.latitude,
                    longitude: input.untilLocation.longitude,
                    radius: input.untilLocation.radius,
                },
            });

            function getWeeklyRecurrence():
                | Prisma.WeeklyRecurrenceUncheckedCreateNestedOneWithoutGeoScheduleConfigInput
                | undefined {
                if (input.repeatingType === "weekly") {
                    return {
                        create: {
                            fromDay: input.repeatingWeekly.startDay,
                            toDay: input.repeatingWeekly.endDay,
                        },
                    };
                }
            }

            function getDailyRecurrence():
                | Prisma.DailyRecurrenceUncheckedCreateNestedOneWithoutGeoScheduleConfigInput
                | Prisma.DailyRecurrenceCreateNestedOneWithoutGeoScheduleConfigInput
                | undefined {
                if (input.repeatingType === "daily") {
                    return {
                        create: {
                            repeatDays: input.repeatingDaily,
                        },
                    };
                }
            }

            await ctx.db.geoScheduleConfig.create({
                data: {
                    userId: ctx.user.id,
                    paused: false,
                    fromTime: input.repeatingTime.startTime,
                    toTime: input.repeatingTime.endTime,
                    appsToBlock: {
                        create: {
                            apps: {
                                createMany: {
                                    data: [
                                        {
                                            appName: "facebook",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    geometryCriteria: {
                        createMany: {
                            data: [
                                {
                                    geometryBlockType: "UNTIL_LEAVING",
                                    placeId: place.id,
                                },
                            ],
                        },
                    },
                    updateDelayType: "TIMED_DELAY",
                    updateDelaySeconds: 3600,
                    deleteStartedDate: new Date(),
                    deletionStatus: "WAITING_FOR_CLIENT",
                    dailyRecurrence: getDailyRecurrence(),
                    weeklyRecurrence: getWeeklyRecurrence(),
                },
            });
        }),
});
