import { z } from "Zod";

import {
    actuallyCreateGeoSchedulePayloadSchema,
    MINUTES_IN_HOUR,
    SECONDS_IN_MINUTE,
} from "@GeoScheduler/validators";

import { createCaller, createTRPCContext } from "../../../src/index";

const RESERVED_TEST_USER_NAME = "RESERVED_TEST_USER_NAME";
jest.mock("../../../src/utils/auth", () => ({
    __esModule: true,
    ...jest.requireActual("../../../src/utils/auth"),
    verify: () => ({
        sub: RESERVED_TEST_USER_NAME,
    }),
}));

jest.mock("../../../src/utils/common", () => ({
    __esModule: true,
    ...jest.requireActual("../../../src/utils/common"),
    getDateNow: () => {
        return new Date("2020-06-09T00:00:00.000Z"); // Tue Jun 09 2020 00:00:00 GMT+0000;
    },
}));

const dailyPayload: z.infer<typeof actuallyCreateGeoSchedulePayloadSchema> = {
    blocks: ["Chrome", "Facebook"],
    untilLocation: {
        longitude: 0,
        latitude: 52,
        radius: 100,
    },
    repeatingTime: {
        startTime: SECONDS_IN_MINUTE * MINUTES_IN_HOUR * 8,
        endTime: SECONDS_IN_MINUTE * MINUTES_IN_HOUR * 4,
    },
    repeatingType: "daily",
    repeatingDaily: ["Saturday", "Sunday"],
};

describe("places router", () => {
    let caller: ReturnType<typeof createCaller>;
    beforeEach(async () => {
        const ctx = await createTRPCContext({
            auth: {
                accessToken: "nonsense_access_token",
            },
            headers: new Headers(),
        });
        caller = createCaller(ctx);

        await ctx.db.user.deleteMany({
            where: {
                id: RESERVED_TEST_USER_NAME,
            },
        });
    });

    test("get all actions again", async () => {
        await caller.geoSchedules.create(dailyPayload);
        const actual1 = await caller.actions.getAll();
        const actual = await caller.actions.getAll();

        const actualResult = actual.map(({ id: _unused, ...rest }) => ({
            ...rest,
        }));

        const expected = [
            {
                fromDate: "2020-06-06T08:00:00.000Z",
                toDate: "2020-06-07T04:00:00.000Z",
            },
            {
                fromDate: "2020-06-07T08:00:00.000Z",
                toDate: "2020-06-08T04:00:00.000Z",
            },
            {
                fromDate: "2020-06-13T08:00:00.000Z",
                toDate: "2020-06-14T04:00:00.000Z",
            },
            {
                fromDate: "2020-06-14T08:00:00.000Z",
                toDate: "2020-06-15T04:00:00.000Z",
            },
            {
                fromDate: "2020-06-20T08:00:00.000Z",
                toDate: "2020-06-21T04:00:00.000Z",
            },
            {
                fromDate: "2020-06-21T08:00:00.000Z",
                toDate: "2020-06-22T04:00:00.000Z",
            },
        ];

        const expectedResult = expected.map((action) => ({
            appNames: ["Chrome", "Facebook"],
            deletionStatus: undefined,
            executionStatus: undefined,
            shouldBeExecuted: true,
            fromDate: new Date(action.fromDate),
            toDate: new Date(action.toDate),
        }));

        expect(actualResult).toEqual(expectedResult);
    });
});
