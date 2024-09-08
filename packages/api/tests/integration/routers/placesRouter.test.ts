import { z } from "zod";

import {
    createPlaceInputSchema,
    placePayloadSchema,
} from "@GeoScheduler/validators";

import { createTestClient } from "../../utils/testClient";
import { prisma, setupTestDb, teardownTestDb } from "../../utils/testDb";

const testClient = createTestClient("http://localhost:3000/api/trpc");

type PlaceInput = z.infer<typeof createPlaceInputSchema>;

describe("Places Router", () => {
    beforeAll(async () => {
        await setupTestDb();
    });

    afterAll(async () => {
        await teardownTestDb();
    });

    it("should create a place", async () => {
        /**
            name: z.string(),
            latitude: z.number().min(-90).max(90),
            longitude: z.number().min(-180).max(180),
            radius: z.number().positive(),
         */

        const newPlace: PlaceInput = {
            name: "abc",
            latitude: 10,
            longitude: 90,
            radius: 29,
        };

        const createdPlace = await testClient.places.create.mutate(newPlace);

        // expect(user).toHaveProperty("id", createdUser.id);
        // expect(user.name).toBe("Get User Test");
        // expect(user.email).toBe("get@example.com");
    });
});
