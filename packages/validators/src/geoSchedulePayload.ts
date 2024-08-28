import { z } from "zod";

const daysOfWeekSchema = z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]);

const MIN_LOCATION_RADIUS_METRES = 30;
const MAX_LOCATION_RADIUS_METRES = 1000 * 10000; // 10,000km

const placeSchema = z.object({
    latitude: z.number().gte(-90).lte(90),
    longitude: z.number().gte(-180).lte(180),
    radius: z
        .number()
        .gte(MIN_LOCATION_RADIUS_METRES)
        .lte(MAX_LOCATION_RADIUS_METRES),
});

const MINUTES_IN_ONE_DAY = 60 * 24;
const SECONDS_IN_ONE_DAY = 60 * MINUTES_IN_ONE_DAY;

const timeRangeSchema = z.object({
    startTime: z.number().gte(0).lte(SECONDS_IN_ONE_DAY),
    endTime: z.number().gte(0).lte(SECONDS_IN_ONE_DAY),
});

const repeatingDailySchema = z.array(daysOfWeekSchema).min(1);

const repeatingWeeklySchema = z.object({
    startDay: daysOfWeekSchema,
    endDay: daysOfWeekSchema,
});

const untilGeometryCriteriaSchema = z.object({
    untilLocation: placeSchema,
});

const createGeoScheduleBasePayloadSchema = untilGeometryCriteriaSchema.extend({
    blocks: z.array(z.string()),
    repeatingTime: timeRangeSchema,
});

const dailySchema = z.object({
    repeatingType: z.literal("daily"),
    repeatingDaily: repeatingDailySchema,
});

const weeklySchema = z.object({
    repeatingType: z.literal("weekly"),
    repeatingWeekly: repeatingWeeklySchema,
});

const createWithWeeklySchema = createGeoScheduleBasePayloadSchema
    .merge(weeklySchema)
    .strict();

const createWithDailySchema = createGeoScheduleBasePayloadSchema
    .merge(dailySchema)
    .strict();

const createGeoSchedulePayloadSchema = z.discriminatedUnion("repeatingType", [
    createWithWeeklySchema.required().strict(),
    createWithDailySchema.required().strict(),
]);

const createPartialGeoSchedulePayloadSchema = z.union([
    createWithWeeklySchema.partial().strict(),
    createWithDailySchema.partial().strict(),
]);

const byIdGeoSchedulePayloadSchema = z.object({ id: z.string() }).strict();

export {
    createGeoSchedulePayloadSchema,
    createWithDailySchema,
    createWithWeeklySchema,
    createGeoScheduleBasePayloadSchema,
    createPartialGeoSchedulePayloadSchema,
    placeSchema,
    untilGeometryCriteriaSchema,
    byIdGeoSchedulePayloadSchema,
    dailySchema,
    weeklySchema,
};
