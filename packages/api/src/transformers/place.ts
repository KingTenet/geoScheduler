import type z from "zod";

import type { Prisma } from "@GeoScheduler/db";
import type { placePayloadSchema } from "@GeoScheduler/validators";

export type PrismaPlace = Prisma.PlaceGetPayload<undefined>;

type PlacePayload = z.infer<typeof placePayloadSchema>;

export function transformPlaceFromDB(prismaPlace: PrismaPlace): PlacePayload {
    const { id, name, latitude, longitude, radius, userId } = prismaPlace;

    return {
        id,
        name,
        latitude,
        longitude,
        radius,
        userId,
    };
}
