import { z } from 'zod';

export const updateAddressSchema = z.object({
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

    params: z.object({
        id: z.string()
    }
    ).strict(),
});


export type UpdateAddressSchema = z.infer<typeof updateAddressSchema>;
export type UpdateAddressBody = z.infer<typeof updateAddressSchema>["body"];
export type UpdateAddressQuery = z.infer<typeof updateAddressSchema>["query"];
export type UpdateAddressParams = z.infer<typeof updateAddressSchema>["params"];