import { z } from "zod";




export const rateOrderProductRequestSchema = z.object({


    body: z.object({
        comment: z.string().max(100).optional(),
        rating: z.number().int().positive().min(1).max(5),
    }),
    params: z.object({
        orderId:z.string().uuid(),
        orderProductId:z.string().uuid(),
    }),
    query: z.object({}),

}).strict();





