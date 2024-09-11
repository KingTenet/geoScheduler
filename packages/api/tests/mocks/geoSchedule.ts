import { MINUTES_IN_HOUR, SECONDS_IN_MINUTE } from "@GeoScheduler/validators";

import { PrismaAction } from "../../src/prismaQueries/actions";
import {
    PrismaAppsToBlock,
    PrismaDailyRecurrence,
    PrismaGeometryCriteria,
    PrismaGeoSchedule,
    PrismaWeeklyRecurrence,
} from "../../src/prismaQueries/geoSchedule";
import { PrismaPlace } from "../../src/prismaQueries/place";
import { PrismaUser } from "../../src/prismaQueries/user";
import { getDateNow } from "../../src/utils/common";
import { getActionsMock } from "./actions";
import { getAppsToBlockMock } from "./apps";
import { getDailyRecurrenceMock } from "./daily";
import { getGeometryCriteriaMock, getPlaceMock } from "./places";
import { getUserMock } from "./user";
import { getWeeklyRecurrenceMock } from "./weekly";

export type PartialKeys =
    | "createdDate"
    | "deleteStartedDate"
    | "deletionStatus"
    | "fromTime"
    | "paused"
    | "toTime"
    | "updateDelaySeconds"
    | "updateDelayType"
    | "updatedDate";

const DEFAULT_PARTIAL_GEOSCHEDULE_CONFIG: Pick<PrismaGeoSchedule, PartialKeys> =
    {
        createdDate: getDateNow(),
        deleteStartedDate: null,
        deletionStatus: null,
        fromTime: SECONDS_IN_MINUTE * MINUTES_IN_HOUR * 14,
        toTime: SECONDS_IN_MINUTE * MINUTES_IN_HOUR * 17,
        paused: false,
        updateDelaySeconds: SECONDS_IN_MINUTE * MINUTES_IN_HOUR * 12,
        updateDelayType: "TIMED_DELAY",
        updatedDate: getDateNow(),
    };

type GetGeoScheduleMockOptions = {
    dailyRecurrence?: Partial<PrismaDailyRecurrence>;
    weeklyRecurrence?: Partial<PrismaWeeklyRecurrence>;
    actions?: Partial<PrismaAction>[];
    appsToBlock?: Partial<PrismaAppsToBlock>;
    user?: Partial<PrismaUser>;
    geometryCriteria?: Partial<PrismaGeometryCriteria>;
    place?: Partial<PrismaPlace>;
};

function getGeoScheduleMock(
    geoSchedule: Partial<PrismaGeoSchedule>,
    options?: GetGeoScheduleMockOptions,
): PrismaGeoSchedule {
    const {
        dailyRecurrence = {},
        weeklyRecurrence = {},
        actions = [],
        appsToBlock = {},
        geometryCriteria = {},
        place = {},
        user = {},
    } = options || {};

    const userToUse = getUserMock(user);

    const partialGeoSchedule: Pick<
        PrismaGeoSchedule,
        PartialKeys | "userId" | "id"
    > = {
        id: "geoScheduleId",
        ...DEFAULT_PARTIAL_GEOSCHEDULE_CONFIG,
        ...geoSchedule,
        userId: userToUse.id,
    };

    const placeToUse = getPlaceMock(place, { user: userToUse });

    const partialWithoutActions = {
        ...partialGeoSchedule,
        weeklyRecurrence: getWeeklyRecurrenceMock(weeklyRecurrence, {
            geoSchedule: partialGeoSchedule,
        }),
        dailyRecurrence: getDailyRecurrenceMock(dailyRecurrence, {
            geoSchedule: partialGeoSchedule,
        }),
        appsToBlock: getAppsToBlockMock(appsToBlock, {
            geoSchedule: partialGeoSchedule,
        }),
        geometryCriteria: getGeometryCriteriaMock(geometryCriteria, {
            geoSchedule: partialGeoSchedule,
            place: placeToUse,
        }),
    };

    return {
        ...partialWithoutActions,
        actions: getActionsMock(actions, {
            geoSchedule: partialWithoutActions,
        }),
    };
}

export { getGeoScheduleMock };
