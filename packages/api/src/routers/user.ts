import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
    delete: publicProcedure.mutation(({ ctx }) => {
        return ctx.db.user.delete({ where: { id: ctx.user.id } });
    }),
});
