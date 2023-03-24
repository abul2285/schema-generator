import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const templateRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        schemaId: z.string(),
        isCustom: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.template.create({
          data: input,
        });
      } catch (error) {
        console.log(error);
      }
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        schemaId: z.string(),
        isCustom: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      try {
        return await ctx.prisma.template.update({ where: { id }, data: rest });
      } catch (error) {
        console.log(error);
      }
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.template.findUnique({
          where: {
            id: input.id,
          },
          include: {
            schemaTemplate: {
              select: {
                id: true,
                schema: true,
                name: true,
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  getAll: publicProcedure
    .input(z.object({ isCustom: z.boolean().default(false) }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.template.findMany({
          where: { isCustom: input.isCustom },
          include: {
            schemaTemplate: {
              select: {
                id: true,
                schema: true,
                name: true,
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.template.delete({
          where: { id: input.id },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
