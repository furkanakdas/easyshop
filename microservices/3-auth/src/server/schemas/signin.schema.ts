import { z } from 'zod';

export const signinSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }).strict(),

  query: z.object({}).strict(),
  params: z.object({}).strict(),
});



