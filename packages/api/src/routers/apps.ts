import { z } from "zod";

import type { Prisma } from "@GeoScheduler/db";

// import { appsPayload } from "@GeoScheduler/validators";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const appsRouter = createTRPCRouter({
    create: publicProcedure
        // .input(appsPayload)
        .mutation(async ({ ctx, input }) => {
            // return ctx.db.app.create({
            //     data: {
            //         appName: "facebook",
            //     },
            // });
        }),

    getLatest: publicProcedure.query(async ({ ctx }) => {
        const post = await ctx.db.post.findFirst({
            orderBy: { createdAt: "desc" },
        });

        return post ?? null;
    }),
});
