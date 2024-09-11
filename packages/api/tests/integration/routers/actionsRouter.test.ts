import { z } from "Zod";

import { actuallyCreateGeoSchedulePayloadSchema } from "@GeoScheduler/validators";

import { createCaller, createTRPCContext } from "../../../src/index";

const RESERVED_TEST_USER_NAME = "RESERVED_TEST_USER_NAME";
jest.mock("../../../src/utils/auth", () => ({
    __esModule: true,
    ...jest.requireActual("../../../src/utils/auth"),
    verify: () => ({
        sub: RESERVED_TEST_USER_NAME,
    }),
}));

const weeklyPayload: z.infer<typeof actuallyCreateGeoSchedulePayloadSchema> = {
    blocks: ["Chrome", "Facebook"],
    untilLocation: {
        longitude: 0,
        latitude: 52,
        radius: 100,
    },
    repeatingTime: {
        startTime: 60 * 60 * 8,
        endTime: 60 * 60 * 10,
    },
    repeatingType: "weekly",
    repeatingWeekly: {
        endDay: "Friday",
        startDay: "Saturday",
    },
};

const dailyPayload: z.infer<typeof actuallyCreateGeoSchedulePayloadSchema> = {
    blocks: ["Chrome", "Facebook"],
    untilLocation: {
        longitude: 0,
        latitude: 52,
        radius: 100,
    },
    repeatingTime: {
        startTime: 60 * 60 * 8,
        endTime: 60 * 60 * 10,
    },
    repeatingType: "daily",
    repeatingDaily: ["Monday", "Tuesday"],
};

xdescribe("places router", () => {
    let caller: ReturnType<typeof createCaller>;
    beforeEach(async () => {
        const ctx = await createTRPCContext({
            auth: {
                accessToken: "nonsense_access_token",
            },
            headers: new Headers(),
        });
        caller = createCaller(ctx);
    });

    xtest("get all actions again", async () => {
        await caller.geoSchedules.create(dailyPayload);
        const actions = await caller.actions.getAll();
        console.log(actions);
    });
});
