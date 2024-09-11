import { PrismaGeoSchedule } from "../../../src/prismaQueries/geoSchedule";
import { createActionsFromGeoScheduleConfig } from "../../../src/transformers/actions";
import { getDateNow } from "../../../src/utils/common";
import { getGeoScheduleMock } from "../../mocks/geoSchedule";
import { getUserMock } from "../../mocks/user";

jest.mock("../../../src/utils/common", () => ({
    __esModule: true,
    ...jest.requireActual("../../../src/utils/common"),
    getDateNow: () => new Date(0),
}));

const geoScheduleExample = {
    id: "geoScheduleConfigId",
    createdDate: getDateNow(),
    deleteStartedDate: getDateNow(),
    deletionStatus: "FAILED",
    fromTime: 32432,
    paused: true,
    toTime: 3242,
    updateDelaySeconds: 1232,
    updateDelayType: "TIMED_DELAY",
    updatedDate: getDateNow(),
    userId: "userId",
    appsToBlock: {
        actionsId: "actionsId",
        geoScheduleConfigId: "geoScheduleConfigId",
        apps: [[]],
        id: "appsToBlockId",
    },
    actions: [
        {
            deletionDateThreshold: getDateNow(),
            deletionStatus: "DELETED",
            executionStatus: "STARTED",
            fromDate: getDateNow(),
            id: "actionsId",
            toDate: getDateNow(),
            geoScheduleConfigId: "geoScheduleConfigId",
            geoScheduleConfig: [{}],
        },
    ],
    geometryCriteria: [
        {
            geoScheduleConfigId: "geoScheduleConfigId",
            geometryBlockType: "UNTIL_ENTERING",
            id: "geometryId",
            place: [{}],
            placeId: "placeId",
        },
    ],
    dailyRecurrence: {
        geoScheduleConfigId: "geoScheduleConfigId",
        id: "dailyRecurrenceId",
        repeatDays: ["Monday", "Sunday"],
    },
    weeklyRecurrence: {
        fromDay: "Monday",
        toDay: "Saturday",
        geoScheduleConfigId: "geoScheduleConfigId",
        id: "weeklyRecurrenceId",
    },
};

describe("actions transformer", () => {
    it("transforms geoSchedules", async () => {
        const prismaGeoSchedule: PrismaGeoSchedule = getGeoScheduleMock({}, {});
        const actions = createActionsFromGeoScheduleConfig(prismaGeoSchedule);

        const now = getDateNow();
        console.log(actions);
    });
});
