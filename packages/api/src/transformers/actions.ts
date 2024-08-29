import type { z } from "zod";

import type { $Enums, Prisma } from "@GeoScheduler/db";
import type { actionPayloadSchema } from "@GeoScheduler/validators";

import type { PrismaGeoSchedule } from "../transformers/geoSchedule";

export type ActionPayload = z.infer<typeof actionPayloadSchema>;

export type PrismaAction = Prisma.ActionsGetPayload<{
    include: {
        geoScheduleConfig: {
            include: {
                appsToBlock: {
                    include: {
                        apps: true;
                    };
                };
            };
        };
    };
}>;

function applyTimeSinceMidnightToDate(
    secsSinceMidnight: number,
    date: Date,
): Date {
    return new Date(dateAtMidnight(date).getTime() + secsSinceMidnight * 1000);
}

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
const MS_IN_1_WEEK = MILLISECONDS_IN_DAY * 7;

function dateAtMidnight(date: Date): Date {
    return new Date(Math.floor(date.getTime() / MILLISECONDS_IN_DAY));
}

function convertDateToPrismaDay(date: Date): $Enums.DayOfWeek {
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ] as const;
    return days[date.getDay()]!;
}

function shouldBeDeleted(prismaAction: PrismaAction) {
    const deletionStartedAt = prismaAction.geoScheduleConfig.deleteStartedDate;

    return Boolean(
        deletionStartedAt &&
            deletionStartedAt < prismaAction.deletionDateThreshold,
    );
}

export function createActionsFromGeoScheduleConfig(
    prismaGeoSchedule: PrismaGeoSchedule,
): Pick<
    PrismaAction,
    "fromDate" | "toDate" | "deletionDateThreshold" | "geoScheduleConfigId"
>[] {
    const fromSecondsAfterMidnight = prismaGeoSchedule.fromTime;
    const toSecondsAfterMidnight = prismaGeoSchedule.toTime;
    const geoScheduleConfigId = prismaGeoSchedule.id;

    const now = Date.now();
    const lastWeek = new Date(now - MS_IN_1_WEEK);
    const twoWeeks = new Date(now + MS_IN_1_WEEK * 2);

    if (prismaGeoSchedule.dailyRecurrence) {
        const recurrence = prismaGeoSchedule.dailyRecurrence;
        const repeatDays = recurrence.repeatDays;
        const delay = prismaGeoSchedule.updateDelaySeconds ?? 0;

        const actions: [Date, Date, Date][] = [];

        let workingDate = lastWeek;

        while (workingDate < twoWeeks) {
            const day = convertDateToPrismaDay(workingDate);
            if (repeatDays.includes(day)) {
                const dateFrom = applyTimeSinceMidnightToDate(
                    fromSecondsAfterMidnight,
                    workingDate,
                );
                let dateTo = applyTimeSinceMidnightToDate(
                    toSecondsAfterMidnight,
                    workingDate,
                );
                dateTo =
                    dateTo > dateFrom
                        ? dateTo
                        : new Date(dateTo.getTime() + MILLISECONDS_IN_DAY);

                const deletionDateThreshold = new Date(
                    dateFrom.getTime() + delay * 1000,
                );

                actions.push([dateFrom, dateTo, deletionDateThreshold]);
            }
            workingDate = new Date(workingDate.getTime() + MILLISECONDS_IN_DAY);
        }

        return actions.map(([dateFrom, dateTo, deletionDateThreshold]) => ({
            geoScheduleConfigId: geoScheduleConfigId,
            fromDate: dateFrom,
            toDate: dateTo,
            deletionDateThreshold: deletionDateThreshold,
        }));
    } else {
        throw new Error("Not supported");
    }
}

export function transformActionFromDB(
    prismaAction: PrismaAction,
): ActionPayload {
    const fromDate = prismaAction.fromDate;
    const toDate = prismaAction.toDate;

    return {
        id: prismaAction.id,
        appNames:
            prismaAction.geoScheduleConfig.appsToBlock?.apps.map(
                (app) => app.appName,
            ) ?? [],
        deletionStatus: prismaAction.deletionStatus ?? undefined,
        executionStatus: prismaAction.executionStatus ?? undefined,
        shouldBeDeleted: shouldBeDeleted(prismaAction),
        fromDate,
        toDate,
    };
}
