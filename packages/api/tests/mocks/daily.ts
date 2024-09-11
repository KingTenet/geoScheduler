import {
    PrismaDailyRecurrence,
    PrismaGeoSchedule,
} from "../../src/prismaQueries/geoSchedule";

const DEFAULT_DAILY_RECURRENCE: Omit<
    PrismaDailyRecurrence,
    "geoScheduleConfigId" | "id"
> = {
    repeatDays: [
        "Sunday",
        "Monday",
        // "Tuesday",
        // "Wednesday",
        // "Thursday",
        // "Friday",
        // "Saturday",
    ],
};

export function getDailyRecurrenceMock(
    partialDailyRecurrence: Partial<PrismaDailyRecurrence>,
    {
        geoSchedule,
    }: {
        geoSchedule: Pick<PrismaGeoSchedule, "id">;
    },
): PrismaDailyRecurrence {
    return {
        ...DEFAULT_DAILY_RECURRENCE,
        ...partialDailyRecurrence,
        geoScheduleConfigId: geoSchedule.id,
        id: `dailyRecurrenceId:${geoSchedule.id}`,
    };
}
