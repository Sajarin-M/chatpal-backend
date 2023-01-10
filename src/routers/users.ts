import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma, Prisma } from '../prisma';
import { publicProcedure, router } from '../trpc';
import jwt from 'jsonwebtoken';

const privateKey = 'temp-key';

const userSelect: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
};

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
        select: userSelect,
      });

      return { token: jwt.sign(user, privateKey) };
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
        select: userSelect,
      });
      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid username or password',
        });
      }
      return { token: jwt.sign(user, privateKey) };
    }),
});
