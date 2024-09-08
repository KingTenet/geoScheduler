import { authedProcedure, createTRPCRouter } from "../trpc";

export const userRouter = createTRPCRouter({
    delete: authedProcedure.mutation(({ ctx }) => {
        return ctx.db.user.delete({ where: { id: ctx.user.id } });
    }),
});
