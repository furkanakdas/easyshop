import { z } from 'zod';




export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }).strict(),

  query: z.object({}).strict(),
  params: z.object({}).strict(),
});


export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>["body"];