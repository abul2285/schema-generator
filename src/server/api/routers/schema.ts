import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const schemaRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        schema: z.string(),
        description: z.string(),
        isCustom: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      try {
        return await prisma.schema.create({
          data: input,
        });
      } catch (error) {
        console.log(error);
      }
    }),
  updateSchema: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        schema: z.string(),
        description: z.string(),
        isCustom: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;

      try {
        return await ctx.prisma.schema.update({
          where: { id },
          data: rest,
        });
      } catch (error) {
        console.log(error);
      }
    }),
  deleteSchema: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.schema.delete({
          where: { id: input.id },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.schema.findMany();
    } catch (error) {
      console.log(error);
    }
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      console.log("fetch");
      try {
        return await prisma.schema.findUnique({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
