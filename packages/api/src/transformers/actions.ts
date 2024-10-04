import type { z } from "zod";

import type { DayOfWeek } from "@GeoScheduler/db";
import type { actionPayloadSchema } from "@GeoScheduler/validators";
import { MS_IN_DAY, MS_IN_WEEK } from "@GeoScheduler/validators";

import type { PrismaAction } from "../prismaQueries/actions";
import type { PrismaGeoSchedule } from "../prismaQueries/geoSchedule";
import { getDateNow } from "../utils/common";

export type ActionPayload = z.infer<typeof actionPayloadSchema>;

export function applyTimeSinceMidnightToDate(
    secsSinceMidnight: number,
    date: Date,
): Date {
    return new Date(dateAtMidnight(date).getTime() + secsSinceMidnight * 1000);
}

export function dateAtMidnight(date: Date): Date {
    return new Date(Math.floor(date.getTime() / MS_IN_DAY) * MS_IN_DAY);
}

function convertDateToPrismaDay(date: Date): DayOfWeek {
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

function shouldBeExecuted(prismaAction: PrismaAction): boolean {
    const deletionStartedAt = prismaAction.geoScheduleConfig.deleteStartedDate;

    return Boolean(
        !deletionStartedAt ||
            deletionStartedAt > prismaAction.deletionDateThreshold,
    );
}

/**
 * Create actions based on the geo schedule config, between 1 week before
 * and 2 weeks after the reference date
 *
 * @param arr The array of objects to group
 * @returns An object with keys as the serialized group keys and values as arrays of objects
 */
export function createActionsFromGeoScheduleConfig(
    prismaGeoSchedule: PrismaGeoSchedule,
    referenceDate: Date = getDateNow(),
): Pick<
    PrismaAction,
    "fromDate" | "toDate" | "deletionDateThreshold" | "geoScheduleConfigId"
>[] {
    const fromSecondsAfterMidnight = prismaGeoSchedule.fromTime;
    const toSecondsAfterMidnight = prismaGeoSchedule.toTime;
    const geoScheduleConfigId = prismaGeoSchedule.id;

    const now = referenceDate.getTime();
    const lastWeek = new Date(now - MS_IN_WEEK);
    const twoWeeks = new Date(now + MS_IN_WEEK * 2);

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
                const dateTo = applyTimeSinceMidnightToDate(
                    toSecondsAfterMidnight,
                    workingDate,
                );
                const dateToUnixTime: number = dateTo.getTime();
                const dateToTomorrow = dateToUnixTime + MS_IN_DAY;

                const dateToToUse =
                    dateTo > dateFrom ? dateTo : new Date(dateToTomorrow);

                const deletionDateThreshold = new Date(
                    dateFrom.getTime() + delay * 1000,
                );

                actions.push([dateFrom, dateToToUse, deletionDateThreshold]);
            }
            workingDate = new Date(workingDate.getTime() + MS_IN_DAY);
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
        executionStatus: prismaAction.executionStatus ?? undefined,
        shouldBeExecuted: shouldBeExecuted(prismaAction),
        fromDate,
        toDate,
    };
}
