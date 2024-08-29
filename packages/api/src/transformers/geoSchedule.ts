import type { z } from "zod";

import type { $Enums, Prisma } from "@GeoScheduler/db";
import {
    createGeoSchedulePayloadSchema,
    dailySchema,
    untilGeometryCriteriaSchema,
    weeklySchema,
} from "@GeoScheduler/validators";

class NotSupportedError extends Error {}

function transformAppsFromDB(app: PrismaApp): PrismaApp {
    const { appName, appsToBlockId, id } = app;

    return {
        appName,
        appsToBlockId,
        id,
    };
}

export type PrismaPlace = Prisma.PlaceGetPayload<undefined>;

export type PrismaGeoSchedule = Prisma.GeoScheduleConfigGetPayload<{
    include: {
        appsToBlock: {
            include: {
                apps: true;
            };
        };
        geometryCriteria: {
            include: {
                place: true;
            };
        };
        dailyRecurrence: true;
        weeklyRecurrence: true;
    };
}>;

export type PrismaApp = Prisma.AppGetPayload<undefined>;

export type PrismaAppsToBlock = Prisma.AppsToBlockGetPayload<{
    include: {
        apps: true;
    };
}>;

export type PrismaGeometryCriteria = Prisma.GeometryCriteriumGetPayload<{
    include: {
        place: true;
    };
}>;

export type PrismaDailyRecurrence = Prisma.DailyRecurrenceGetPayload<undefined>;
export type PrismaWeeklyRecurrence =
    Prisma.WeeklyRecurrenceGetPayload<undefined>;

function transformAppsToBlockFromDB(
    appsToBlock: PrismaAppsToBlock | null,
): PrismaAppsToBlock {
    if (!appsToBlock) {
        throw new NotSupportedError();
    }

    const { id, actionsId, geoScheduleConfigId, apps } = appsToBlock;

    return {
        id,
        actionsId,
        geoScheduleConfigId,
        apps: apps.map(transformAppsFromDB),
    };
}

function transformPlace(place: PrismaPlace): PrismaPlace {
    const {
        id,
        name,
        userId,
        latitude,
        longitude,
        radius,
        createdAt,
        updatedAt,
    } = place;

    return {
        id,
        name,
        userId,
        latitude,
        longitude,
        radius,
        createdAt,
        updatedAt,
    };
}

function transformGeometryCriteria(geometryCriteria: PrismaGeometryCriteria) {
    const { id, geometryBlockType, placeId, geoScheduleConfigId, place } =
        geometryCriteria;

    return {
        id,
        geometryBlockType,
        placeId,
        geoScheduleConfigId,
        place: transformPlace(place),
    };
}

function isDailyRecurrence(
    recurrence: PrismaDailyRecurrence | PrismaWeeklyRecurrence,
): recurrence is PrismaDailyRecurrence {
    return "repeatDays" in recurrence;
}

function transformRecurrence(
    recurrence: PrismaDailyRecurrence | PrismaWeeklyRecurrence,
): PrismaDailyRecurrence | PrismaWeeklyRecurrence {
    if (isDailyRecurrence(recurrence)) {
        const { id, repeatDays, geoScheduleConfigId } = recurrence;
        return {
            id,
            geoScheduleConfigId,
            repeatDays,
        };
    }

    const {
        id: weeklyRecurrenceId,
        fromDay,
        toDay,
        geoScheduleConfigId,
    } = recurrence;

    return {
        id: weeklyRecurrenceId,
        fromDay,
        toDay,
        geoScheduleConfigId,
    };
}

type GeoSchedulePayload = z.infer<typeof createGeoSchedulePayloadSchema>;
type UntilLocationPayload = z.infer<typeof untilGeometryCriteriaSchema>;
type WithWeeklyPayload = z.infer<typeof weeklySchema>;
type WithDailyPayload = z.infer<typeof dailySchema>;

export function transformGeoScheduleFromDB(
    prismaGeoSchedule: PrismaGeoSchedule,
): GeoSchedulePayload {
    const {
        id,
        fromTime,
        toTime,
        paused,
        updateDelayType,
        updateDelaySeconds,
        createdDate,
        updatedDate,
        deleteStartedDate,
        deletionStatus,
        userId,
        appsToBlock,
        geometryCriteria,
        dailyRecurrence,
        weeklyRecurrence,
    } = prismaGeoSchedule;

    const recurrence = dailyRecurrence ?? weeklyRecurrence;
    if (!recurrence) {
        throw new NotSupportedError();
    }

    const transformed = {
        id,
        fromTime,
        toTime,
        paused,
        updateDelayType,
        updateDelaySeconds,
        createdDate,
        updatedDate,
        deleteStartedDate,
        deletionStatus,
        userId,
        appsToBlock: transformAppsToBlockFromDB(appsToBlock),
        geometryCriteria: geometryCriteria.map(transformGeometryCriteria),
        recurrence: transformRecurrence(recurrence),
    };

    function getUntilLocationGeometryCriterium(
        geometry: PrismaGeometryCriteria[],
    ): PrismaGeometryCriteria {
        function isPrismaGeometryCriteria(
            test: PrismaGeometryCriteria | undefined,
        ): test is PrismaGeometryCriteria {
            return Boolean(test);
        }

        const onlyGeometryCriterium = geometry[0];

        if (!isPrismaGeometryCriteria(onlyGeometryCriterium)) {
            throw new NotSupportedError();
        }

        switch (onlyGeometryCriterium.geometryBlockType) {
            case "UNTIL_ENTERING":
                throw new NotSupportedError();
            case "UNTIL_LEAVING":
                return onlyGeometryCriterium;
            case "WHEN_INSIDE":
                throw new NotSupportedError();
            case "WHEN_OUTSIDE":
                throw new NotSupportedError();
        }
    }

    function getUntilLocation(): UntilLocationPayload {
        const geometryCriterium =
            getUntilLocationGeometryCriterium(geometryCriteria);
        return {
            untilLocation: {
                latitude: geometryCriterium.place.latitude,
                longitude: geometryCriterium.place.longitude,
                radius: geometryCriterium.place.radius,
            },
        };
    }

    function getRepeatingConfig(
        testRecurrence: PrismaDailyRecurrence | PrismaWeeklyRecurrence,
    ): WithWeeklyPayload | WithDailyPayload {
        if (isDailyRecurrence(testRecurrence)) {
            return {
                repeatingType: "daily",
                repeatingDaily: testRecurrence.repeatDays,
            };
        }

        return {
            repeatingType: "weekly",
            repeatingWeekly: {
                startDay: testRecurrence.fromDay,
                endDay: testRecurrence.toDay,
            },
        };
    }

    const geoSchedulePayload = {
        id,
        blocks: appsToBlock?.apps.map(({ appName }) => appName) ?? [],
        ...getUntilLocation(),
        ...getRepeatingConfig(recurrence),
        repeatingTime: {
            startTime: fromTime,
            endTime: toTime,
        },
    };

    const { data, success } =
        createGeoSchedulePayloadSchema.safeParse(geoSchedulePayload);
    if (!success) {
        throw new Error("Schema validation failed");
    }

    return data;
}