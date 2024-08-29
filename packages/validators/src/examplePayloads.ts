import type { z } from "zod";

import type { actuallyCreateGeoSchedulePayloadSchema } from "./geoSchedulePayload";

type CreateGeoSchedulePayload = z.infer<
    typeof actuallyCreateGeoSchedulePayloadSchema
>;

const examplePayloadWeekly: CreateGeoSchedulePayload = {
    blocks: ["Chrome", "Facebook"],
    untilLocation: {
        longitude: 0,
        latitude: 52,
        radius: 100,
    },
    repeatingType: "weekly",
    repeatingWeekly: {
        startDay: "Saturday",
        endDay: "Sunday",
    },
    repeatingTime: {
        startTime: 60 * 60 * 8,
        endTime: 60 * 60 * 10,
    },
};

const examplePayloadDaily: CreateGeoSchedulePayload = {
    blocks: ["Chrome", "Facebook"],
    untilLocation: {
        longitude: 0,
        latitude: 52,
        radius: 100,
    },
    repeatingType: "daily",
    repeatingDaily: ["Monday", "Tuesday"],
    repeatingTime: {
        startTime: 60 * 60 * 8,
        endTime: 60 * 60 * 10,
    },
};

export { examplePayloadDaily, examplePayloadWeekly };
