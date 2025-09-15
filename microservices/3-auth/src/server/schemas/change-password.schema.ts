import { z } from 'zod';

export const changePasswordSchema = z.object({
  body: z.object({

    currentPassword: z.string(),
    newPassword: z.string().min(6),

  }).strict(),

  query: z.object({}).strict(),
  params: z.object({}).strict(),
});


export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type ChangePasswordBody = z.infer<typeof changePasswordSchema>["body"];