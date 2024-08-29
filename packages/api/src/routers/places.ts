import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const placesRouter = createTRPCRouter({
    create: publicProcedure
        .input(
            z.object({
                name: z.string(),
                latitude: z.number(),
                longitude: z.number(),
                radius: z.number(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.place.create({
                data: {
                    name: input.name,
                    latitude: input.latitude,
                    longitude: input.longitude,
                    radius: input.radius,
                    userId: ctx.user.id,
                },
            });
        }),
});
