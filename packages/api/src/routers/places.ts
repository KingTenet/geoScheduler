import { placePayloadSchema } from "@GeoScheduler/validators";

import { transformPlaceFromDB } from "../transformers/place";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const placesRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        //     const transformedPlace = {
        //         id: "abc",
        //         latitude: 80,
        //         longitude: 123,
        //         name: "felix",
        //         radius: 123,
        //         userId: "124",
        //     };
        //     const validatedPlace = placePayloadSchema.parse(transformedPlace);
        //     return [validatedPlace];

        const places = await ctx.db.place.findMany({
            where: { userId: ctx.user.id },
        });

        return places.map((place) => {
            const transformedPlace = transformPlaceFromDB(place);
            const validatedPlace = placePayloadSchema.parse(transformedPlace);
            return validatedPlace;
        });
    }),
    // create: publicProcedure
    //     .input(createPlaceInputSchema)
    //     .mutation(async ({ ctx, input }) => {
    //         const place = await ctx.db.place.create({
    //             data: {
    //                 ...input,
    //                 userId: ctx.user.id,
    //             },
    //         });

    //         const transformedPlace = transformPlaceFromDB(place);
    //         return placePayloadSchema.parse(transformedPlace);
    //     }),

    // byId: publicProcedure
    //     .input(placePayloadSchema.pick({ id: true }))
    //     .query(async ({ ctx, input }) => {
    //         const place = await ctx.db.place.findUnique({
    //             where: { id: input.id, userId: ctx.user.id },
    //         });

    //         if (!place) {
    //             throw new TRPCError({
    //                 code: "NOT_FOUND",
    //                 message: `No place with id '${input.id}'`,
    //             });
    //         }

    //         const transformedPlace = transformPlaceFromDB(place);
    //         return placePayloadSchema.parse(transformedPlace);
    //     }),
});
