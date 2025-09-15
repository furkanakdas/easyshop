import { z } from "zod";






export const updateInventoryBodySchema = z.object({


    quantity: z.number().nonnegative(),
        
}).strict();

export const updateInventoryRequestSchema = z.object({

    body: updateInventoryBodySchema,
    query: z.object({}).strict(),
    params: z.object({id:z.string()}).strict(),
})




