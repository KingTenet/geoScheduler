import { z } from "zod";

import type { Prisma } from "@GeoScheduler/db";
import { appsPayload } from "@GeoScheduler/validators";

import { createTRPCRouter, authedProcedure } from "../trpc";

export const appsRouter = createTRPCRouter({
    create: authedProcedure
        .input(appsPayload)
        .mutation(async ({ ctx, input }) => {
            // const post = await ctx.db.app.createMany({data: [{
            //     "appName"
            // }]})
        }),
});
