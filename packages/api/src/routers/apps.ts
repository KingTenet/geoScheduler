import { appsPayload } from "@GeoScheduler/validators";

import { authedProcedure, createTRPCRouter } from "../trpc";

export const appsRouter = createTRPCRouter({
    create: authedProcedure
        .input(appsPayload)
        .mutation(async ({ ctx, input }) => {
            // const post = await ctx.db.app.createMany({data: [{
            //     "appName"
            // }]})
        }),
});
