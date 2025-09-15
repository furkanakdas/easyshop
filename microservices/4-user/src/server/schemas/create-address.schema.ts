import { z } from 'zod';

export const createAddressSchema = z.object({
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().regex(/^\+90\d{10}$/, {
      message: "Geçerli bir telefon numarasi giriniz. Örn: +905xxxxxxxxx",
    }),
    city: z.string(),
    district: z.string(),
    neighbourhood: z.string(),
    detailedAddress: z.string(),
    title: z.string(),

  }).strict(),

  query: z.object({}).strict(),
  params: z.object({}).strict(),
});


export type CreateAddressSchema = z.infer<typeof createAddressSchema>;
export type CreateAddressBody = z.infer<typeof createAddressSchema>["body"];
export type CreateAddressQuery = z.infer<typeof createAddressSchema>["query"];
export type CreateAddressParams = z.infer<typeof createAddressSchema>["params"];
