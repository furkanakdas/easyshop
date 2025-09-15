import { z } from 'zod';

export const updateBuyerProfileSchema = z.object({
  body: z.object({

    firstName: z.string().optional(),
    lastName: z.string().optional(),

  }).strict(),

  query: z.object({}).strict(),
  params: z.object({}).strict(),
});


export type UpdateBuyerProfileSchema = z.infer<typeof updateBuyerProfileSchema>;
export type UpdateBuyerProfileBody = z.infer<typeof updateBuyerProfileSchema>["body"];