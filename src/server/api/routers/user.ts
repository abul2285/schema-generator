import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        role: z.string(),
        email: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { prisma } = ctx;
        const { id, ...rest } = input;

        return await prisma.user.update({
          where: { id },
          data: rest,
        });
      } catch (error) {
        console.log({ error });
      }
    }),
});
