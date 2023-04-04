import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const schemaRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        schema: z.string(),
        description: z.string(),
        templateName: z.string().optional(),
        isCustom: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { id: creatorId } = session.user;

      try {
        return await prisma.schema.create({
          data: { ...input, creatorId },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  updateSchema: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        schema: z.string().optional(),
        description: z.string().optional(),
        templateName: z.string().optional(),
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
  deleteSchema: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      const { id: creatorId } = session.user;
      try {
        return await ctx.prisma.schema.delete({
          where: { id: input.id, creatorId },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getCurrentUserSchemas: protectedProcedure
    .input(
      z
        .object({
          templateOnly: z.boolean().optional(),
          schemaOnly: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const { prisma, session } = ctx;
        const { id: creatorId } = session.user;
        const filter: { templateName?: { not?: null; equals?: null } } = {};
        if (input?.templateOnly) {
          filter.templateName = { not: null };
        }
        if (input?.schemaOnly) {
          filter.templateName = { equals: null };
        }
        return await prisma.schema.findMany({
          where: { creatorId, ...filter },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getDefaultSchemas: publicProcedure
    .input(z.object({ templateOnly: z.boolean().optional() }).optional())
    .query(async ({ ctx, input }) => {
      try {
        const { prisma } = ctx;
        const filter: { templateName?: { not: null } } = {};
        if (input?.templateOnly) {
          filter.templateName = { not: null };
        }
        return await prisma.schema.findMany({
          where: { isCustom: false },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      try {
        return await prisma.schema.findUnique({
          where: {
            id: input.id,
            creatorId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
