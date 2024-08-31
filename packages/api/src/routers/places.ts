import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
    createPlaceInputSchema,
    placePayloadSchema,
} from "@GeoScheduler/validators";

import { transformPlaceFromDB } from "../transformers/place";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const placesRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const places = await ctx.db.place.findMany({
            where: { userId: ctx.user.id },
        });

        return places.map((place) => {
            const transformedPlace = transformPlaceFromDB(place);
            const validatedPlace = placePayloadSchema.parse(transformedPlace);
            return validatedPlace;
        });
    }),

    byId: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const place = await ctx.db.place.findUnique({
                where: { id: input.id, userId: ctx.user.id },
            });

            if (!place) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `No place with id '${input.id}'`,
                });
            }

            const transformedPlace = transformPlaceFromDB(place);
            return placePayloadSchema.parse(transformedPlace);
        }),

    create: publicProcedure
        .input(createPlaceInputSchema)
        .mutation(async ({ ctx, input }) => {
            await ctx.db.user.upsert({
                where: {
                    id: ctx.user.id,
                },
                update: {},
                create: {
                    id: ctx.user.id,
                },
            });

            const place = await ctx.db.place.create({
                data: {
                    ...input,
                    userId: ctx.user.id,
                },
            });

            const transformedPlace = transformPlaceFromDB(place);
            return placePayloadSchema.parse(transformedPlace);
        }),
});
