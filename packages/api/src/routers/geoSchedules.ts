import { z } from "zod";

import type { Prisma } from "@GeoScheduler/db";
import {
    byIdGeoSchedulePayloadSchema,
    createGeoSchedulePayloadSchema,
} from "@GeoScheduler/validators";

import { createTRPCRouter, publicProcedure } from "../trpc";

/*

model GeoScheduleConfig {
    id                 String                 @id @default(uuid())
    externalBlocks     ExternalBlock[]
    geometryCriteria   GeometryCriterium[]
    fromTime           DateTime?
    toTime             DateTime?
    paused             Boolean
    updateDelayType    UpdateDelayType?
    updateDelaySeconds Int?
    createdDate        DateTime               @default(now())
    updatedDate        DateTime               @updatedAt
    deleteStartedDate  DateTime?
    deletionStatus     ScheduleDeletedStatus?
    user               User                   @relation(fields: [userId], references: [id])
    userId             String
    dailyRecurrence    DailyRecurrence?
    weeklyRecurrence   WeeklyRecurrence?
    Actions            Actions[]
}*/

type User = {
    userId: string;
};

// function transformPayloadToPrismaCreate(
//     input: z.infer<typeof createGeoSchedulePayloadSchema>,
//     user: User,
// ): Prisma.GeoScheduleConfigCreateArgs {

// }

// function isWeekly(
//     maybeWeekly: z.infer<typeof createGeoSchedulePayloadSchema>,
// ): maybeWeekly is z.infer<typeof createWithWeeklySchema> {
//     return Boolean("repeatingWeekly" in maybeWeekly);
// }

// function isDaily(
//     maybe: z.infer<typeof createGeoSchedulePayloadSchema>,
// ): maybe is z.infer<typeof createWithDailySchema> {
//     return Boolean("repeatingDaily" in maybe);
// }

export const geoSchedulesRouter = createTRPCRouter({
    all: publicProcedure.query(({ ctx }) => {
        return ctx.db.geoScheduleConfig.findMany({
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
    }),

    getLatest: publicProcedure.query(async ({ ctx }) => {
        const post = await ctx.db.geoScheduleConfig.findFirst({
            orderBy: { createdDate: "desc" },
        });

        return post ?? null;
    }),

    byId: publicProcedure
        .input(byIdGeoSchedulePayloadSchema)
        .query(async ({ ctx, input }) => {
            const geoSchedule = await ctx.db.geoScheduleConfig.findFirst({
                where: input,
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

            return geoSchedule ?? null;
        }),

    delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
        return ctx.db.geoScheduleConfig.delete({ where: { id: input } });
    }),

    create: publicProcedure
        .input(createGeoSchedulePayloadSchema)
        .mutation(async ({ ctx, input }) => {
            const place = await ctx.db.place.create({
                data: {
                    name: "Edinburgh" + `${Math.random()}`.slice(0, 5),
                    userId: ctx.user.id,
                    latitude: input.untilLocation.latitude,
                    longitude: input.untilLocation.longitude,
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
