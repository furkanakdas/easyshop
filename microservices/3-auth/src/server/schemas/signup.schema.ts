import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }).strict(),

  query: z.object({}).strict(),
  params: z.object({}).strict(),
});




export type SignupBody = z.infer<typeof signupSchema.shape.body>;

