import {
    PrismaGeoSchedule,
    PrismaWeeklyRecurrence,
} from "../../src/prismaQueries/geoSchedule";

const DEFAULT_WEEKLY_RECURRENCE: Omit<
    PrismaWeeklyRecurrence,
    "geoScheduleConfigId" | "id"
> = {
    fromDay: "Monday",
    toDay: "Friday",
};

export function getWeeklyRecurrenceMock(
    partialWeeklyRecurrence: Partial<PrismaWeeklyRecurrence>,
    {
        geoSchedule,
    }: {
        geoSchedule: Pick<PrismaGeoSchedule, "id">;
    },
): PrismaWeeklyRecurrence {
    return {
        ...DEFAULT_WEEKLY_RECURRENCE,
        ...partialWeeklyRecurrence,
        geoScheduleConfigId: geoSchedule.id,
        id: `weeklyRecurrenceId:${geoSchedule.id}`,
    };
}
