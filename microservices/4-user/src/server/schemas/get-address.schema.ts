import { z } from 'zod';

export const getAddressSchema = z.object({
    body: z.object({}).strict(),

    query: z.object({}).strict(),

    params: z.object({

        id:z.string()

    }).strict(),
});


export type GetAddressSchema = z.infer<typeof getAddressSchema>;
export type GetAddressBody = z.infer<typeof getAddressSchema>["body"];
export type GetAddressQuery = z.infer<typeof getAddressSchema>["query"];
export type GetAddressParams = z.infer<typeof getAddressSchema>["params"];
