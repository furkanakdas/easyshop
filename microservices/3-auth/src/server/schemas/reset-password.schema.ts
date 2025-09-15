import { z } from 'zod';

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string(),
    password: z.string().min(6),

  }).strict(),

  query: z.object({}).strict(),
  params: z.object({}).strict(),
});


export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>["body"];