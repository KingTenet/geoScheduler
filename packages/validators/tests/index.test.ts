import { describe, expect, test } from "@jest/globals";
import { z } from "zod";

import {
    createGeoScheduleBasePayloadSchema,
    createGeoSchedulePayloadSchema,
} from "../src/geoSchedulePayload";

const validBasePayload: z.infer<typeof createGeoScheduleBasePayloadSchema> = {
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
};

const validWeeklyPayload = {
    repeatingType: "weekly",
    repeatingWeekly: {
        startDay: "Monday",
        endDay: "Tuesday",
    },
};

const validDailyPayload = {
    repeatingType: "daily",
    repeatingDaily: ["Monday", "Tuesday"],
};

describe("createGeoSchedulePayloadSchema", () => {
    test("invalidates schema with erroneous key", () => {
        const schemaValidate = createGeoSchedulePayloadSchema.safeParse({
            ...validBasePayload,
            ...validDailyPayload,
            erroneousKey: "124",
        });

        expect(schemaValidate.success).toBe(false);
    });

    test("validates schema with repeating weeks", () => {
        const schemaValidate = createGeoSchedulePayloadSchema.safeParse({
            ...validBasePayload,
            ...validWeeklyPayload,
        });
        expect(schemaValidate.success).toBe(true);
    });

    test("validates schema with repeating days", () => {
        const schemaValidate = createGeoSchedulePayloadSchema.safeParse({
            ...validBasePayload,
            ...validDailyPayload,
        });
        expect(schemaValidate.success).toBe(true);
    });

    test("invalidates schema with repeating weeks and days", () => {
        const schemaValidate = createGeoSchedulePayloadSchema.safeParse({
            ...validBasePayload,
            ...validWeeklyPayload,
            ...validDailyPayload,
        });
        expect(schemaValidate.success).toBe(false);
    });
});
