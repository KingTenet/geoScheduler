// import type { Prisma } from "@GeoScheduler/db";
import { Prisma } from "@GeoScheduler/db";

import { prismaActionQuery } from "./actions";

// export const prismaGeoScheduleWhereUser = (userId: string) => ({
//     where: {
//         userId: userId,
//     },
// });

export const prismaGeoScheduleQuery = {
    include: {
        actions: {
            ...prismaActionQuery,
        },
        appsToBlock: {
            select: {
                id: true,
                apps: true,
                // actionsId: true,
                geoScheduleConfigId: true,
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
};

export type PrismaGeoSchedule = Prisma.GeoScheduleConfigGetPayload<
    typeof prismaGeoScheduleQuery
>;

export type PrismaApp = Prisma.AppGetPayload<undefined>;

export const prismaAppsToBlock = {
    select: {
        id: true,
        apps: true,
        // actionsId: true,
        geoScheduleConfigId: true,
    },
};

export type PrismaAppsToBlock = Prisma.AppsToBlockGetPayload<
    typeof prismaAppsToBlock
>;

export type PrismaGeometryCriteria = Prisma.GeometryCriteriumGetPayload<{
    include: {
        place: true;
    };
}>;

export type PrismaDailyRecurrence = Prisma.DailyRecurrenceGetPayload<undefined>;
export type PrismaWeeklyRecurrence =
    Prisma.WeeklyRecurrenceGetPayload<undefined>;
