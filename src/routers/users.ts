import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../prisma';
import { publicProcedure, router } from '../trpc';

export const usersRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.create({
        data: input,
      });

      return { token: 'hi' };
    }),
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input: { username, password } }) => {
      const user = await prisma.user.findFirst({
        where: {
          email: username,
          password,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid username or password',
        });
      }
      return { token: 'hi' };
    }),
});
