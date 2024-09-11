import {
    MINUTES_IN_HOUR,
    MS_IN_DAY,
    SECONDS_IN_DAY,
    SECONDS_IN_MINUTE,
} from "@GeoScheduler/validators";

import type { PrismaGeoSchedule } from "../../../src/prismaQueries/geoSchedule";
import {
    createActionsFromGeoScheduleConfig,
    dateAtMidnight,
} from "../../../src/transformers/actions";
import { getDateNow } from "../../../src/utils/common";
import { getGeoScheduleMock } from "../../mocks/geoSchedule";

jest.mock("../../../src/utils/common", () => ({
    __esModule: true,
    ...jest.requireActual("../../../src/utils/common"),
    getDateNow: () => {
        return new Date("2020-06-09T00:00:00.000Z"); // Tue Jun 09 2020 00:00:00 GMT+0000;
    },
}));

// const geoScheduleExample = {
//     id: "geoScheduleConfigId",
//     createdDate: getDateNow(),
//     deleteStartedDate: getDateNow(),
//     deletionStatus: "FAILED",
//     fromTime: 32432,
//     paused: true,
//     toTime: 3242,
//     updateDelaySeconds: 1232,
//     updateDelayType: "TIMED_DELAY",
//     updatedDate: getDateNow(),
//     userId: "userId",
//     appsToBlock: {
//         actionsId: "actionsId",
//         geoScheduleConfigId: "geoScheduleConfigId",
//         apps: [[]],
//         id: "appsToBlockId",
//     },
//     actions: [
//         {
//             deletionDateThreshold: getDateNow(),
//             deletionStatus: "DELETED",
//             executionStatus: "STARTED",
//             fromDate: getDateNow(),
//             id: "actionsId",
//             toDate: getDateNow(),
//             geoScheduleConfigId: "geoScheduleConfigId",
//             geoScheduleConfig: [{}],
//         },
//     ],
//     geometryCriteria: [
//         {
//             geoScheduleConfigId: "geoScheduleConfigId",
//             geometryBlockType: "UNTIL_ENTERING",
//             id: "geometryId",
//             place: [{}],
//             placeId: "placeId",
//         },
//     ],
//     dailyRecurrence: {
//         geoScheduleConfigId: "geoScheduleConfigId",
//         id: "dailyRecurrenceId",
//         repeatDays: ["Monday", "Sunday"],
//     },
//     weeklyRecurrence: {
//         fromDay: "Monday",
//         toDay: "Saturday",
//         geoScheduleConfigId: "geoScheduleConfigId",
//         id: "weeklyRecurrenceId",
//     },
// };

interface UserFriendlyPartialAction {
    geoScheduleConfigId: string;
    fromDate: string;
    toDate: string;
    deletionDateThreshold: string;
}

describe("actions transformer", () => {
    it("transforms geoSchedules", () => {
        // Start date: new Date("2020-06-09T00:00:00.000Z"); // Tue Jun 09 2020 00:00:00 GMT+0000;

        const prismaGeoSchedule: PrismaGeoSchedule = getGeoScheduleMock(
            {
                fromTime: SECONDS_IN_MINUTE * MINUTES_IN_HOUR * 4, // 4am
                toTime: SECONDS_IN_MINUTE * MINUTES_IN_HOUR * 8, // 8am
                updateDelaySeconds: SECONDS_IN_DAY, // 4am
            },
            {
                dailyRecurrence: {
                    repeatDays: ["Saturday", "Sunday"],
                },
            },
        );

        /**
         * 06/06/2020 04 - 08 Saturday,
         * 07/06/2020 04 - 08 Sunday,
         * 13/06/2020 04 - 08 Saturday,
         * 14/06/2020 04 - 08 Sunday,
         * 20/06/2020 04 - 08 Saturday,
         * 21/06/2020 04 - 08 Sunday,
         */

        const actualResult =
            createActionsFromGeoScheduleConfig(prismaGeoSchedule);

        const expected = [
            {
                geoScheduleConfigId: "geoScheduleId",
                fromDate: "2020-06-06T04:00:00.000Z",
                toDate: "2020-06-06T08:00:00.000Z",
                deletionDateThreshold: "2020-06-07T04:00:00.000Z",
            },
            {
                geoScheduleConfigId: "geoScheduleId",
                fromDate: "2020-06-07T04:00:00.000Z",
                toDate: "2020-06-07T08:00:00.000Z",
                deletionDateThreshold: "2020-06-08T04:00:00.000Z",
            },
            {
                geoScheduleConfigId: "geoScheduleId",
                fromDate: "2020-06-13T04:00:00.000Z",
                toDate: "2020-06-13T08:00:00.000Z",
                deletionDateThreshold: "2020-06-14T04:00:00.000Z",
            },
            {
                geoScheduleConfigId: "geoScheduleId",
                fromDate: "2020-06-14T04:00:00.000Z",
                toDate: "2020-06-14T08:00:00.000Z",
                deletionDateThreshold: "2020-06-15T04:00:00.000Z",
            },
            {
                geoScheduleConfigId: "geoScheduleId",
                fromDate: "2020-06-20T04:00:00.000Z",
                toDate: "2020-06-20T08:00:00.000Z",
                deletionDateThreshold: "2020-06-21T04:00:00.000Z",
            },
            {
                geoScheduleConfigId: "geoScheduleId",
                fromDate: "2020-06-21T04:00:00.000Z",
                toDate: "2020-06-21T08:00:00.000Z",
                deletionDateThreshold: "2020-06-22T04:00:00.000Z",
            },
        ];

        const expectedResult = expected.map(
            (action: UserFriendlyPartialAction) => ({
                geoScheduleConfigId: action.geoScheduleConfigId,
                fromDate: new Date(action.fromDate),
                toDate: new Date(action.toDate),
                deletionDateThreshold: new Date(action.deletionDateThreshold),
            }),
        );

        expect(actualResult).toEqual(expectedResult);
    });

    it("transforms geoSchedules with from time earlier than to time", () => {
        // Start date: new Date("2020-06-09T00:00:00.000Z"); // Tue Jun 09 2020 00:00:00 GMT+0000;

        const prismaGeoSchedule: PrismaGeoSchedule = getGeoScheduleMock(
            {
                fromTime: SECONDS_IN_MINUTE * MINUTES_IN_HOUR * 8, // 4am
                toTime: SECONDS_IN_MINUTE * MINUTES_IN_HOUR * 4, // 8am
                updateDelaySeconds: SECONDS_IN_DAY, // 4am
            },
            {
                dailyRecurrence: {
                    repeatDays: ["Saturday", "Sunday"],
                },
            },
        );

        /**
         * 06/06/2020 04 - 08 Saturday,
         * 07/06/2020 04 - 08 Sunday,
         * 13/06/2020 04 - 08 Saturday,
         * 14/06/2020 04 - 08 Sunday,
         * 20/06/2020 04 - 08 Saturday,
         * 21/06/2020 04 - 08 Sunday,
         */

        const actualResult =
            createActionsFromGeoScheduleConfig(prismaGeoSchedule);

        const expected = [
            {
                geoScheduleConfigId: "geoScheduleId",
                fromDate: "2020-06-06T08:00:00.000Z",
                toDate: "2020-06-07T04:00:00.000Z",
                deletionDateThreshold: "2020-06-07T08:00:00.000Z",
            },
            {
                geoScheduleConfigId: "geoScheduleId",
                fromDate: "2020-06-07T08:00:00.000Z",
                toDate: "2020-06-08T04:00:00.000Z",
                deletionDateThreshold: "2020-06-08T08:00:00.000Z",
            },
            {
                geoScheduleConfigId: "geoScheduleId",
                fromDate: "2020-06-13T08:00:00.000Z",
                toDate: "2020-06-14T04:00:00.000Z",
                deletionDateThreshold: "2020-06-14T08:00:00.000Z",
            },
            {
                geoScheduleConfigId: "geoScheduleId",
                fromDate: "2020-06-14T08:00:00.000Z",
                toDate: "2020-06-15T04:00:00.000Z",
                deletionDateThreshold: "2020-06-15T08:00:00.000Z",
            },
            {
                geoScheduleConfigId: "geoScheduleId",
                fromDate: "2020-06-20T08:00:00.000Z",
                toDate: "2020-06-21T04:00:00.000Z",
                deletionDateThreshold: "2020-06-21T08:00:00.000Z",
            },
            {
                geoScheduleConfigId: "geoScheduleId",
                fromDate: "2020-06-21T08:00:00.000Z",
                toDate: "2020-06-22T04:00:00.000Z",
                deletionDateThreshold: "2020-06-22T08:00:00.000Z",
            },
        ];

        const expectedResult = expected.map(
            (action: UserFriendlyPartialAction) => ({
                geoScheduleConfigId: action.geoScheduleConfigId,
                fromDate: new Date(action.fromDate),
                toDate: new Date(action.toDate),
                deletionDateThreshold: new Date(action.deletionDateThreshold),
            }),
        );

        expect(actualResult).toEqual(expectedResult);
    });
});

describe("utils functions", () => {
    it("mocks date correctly", () => {
        const expected = getDateNow();
        expect(new Date("2020-06-09T00:00:00.000Z").getTime()).toBe(
            expected.getTime(),
        );
    });

    it("date at midnight", () => {
        const actualResult = dateAtMidnight(new Date((MS_IN_DAY * 3) / 2));
        const expectedResult = new Date(MS_IN_DAY);
        expect(actualResult.getTime()).toBe(expectedResult.getTime());
    });
});
