import { z } from "zod";




export const rateSellerRequestSchema = z.object({


    body: z.object({
        comment: z.string().max(100).optional(),
        rating: z.number().int().positive().min(1).max(5),
    }),
    params: z.object({
        sellerId:z.string().uuid(),
        orderId:z.string().uuid(),
    }),
    query: z.object({}),

}).strict();





