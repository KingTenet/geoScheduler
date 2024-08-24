import type { z } from "zod";

import type { createGeoSchedulePayloadSchema } from "./geoSchedulePayload";

type createGeoSchedulePayloadSchemaType = z.infer<
    typeof createGeoSchedulePayloadSchema
>;

const examplePayloadWeekly: createGeoSchedulePayloadSchemaType = {
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

const examplePayloadDaily: createGeoSchedulePayloadSchemaType = {
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
