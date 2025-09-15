import { z } from "zod"





export const createPaymentIntentRequestSchema = z.object({

    body: z.object({ orderId: z.string().uuid() }).strict(),
    params: z.object({}),
    query: z.object({}),

})



export const getPaymentIntentRequestSchema = z.object({

    body: z.undefined(),
    params: z.object({ paymentIntentId: z.string()}),
    query: z.object({}),

})


export const cancelPaymentIntentRequestSchema = z.object({

    body: z.object({ paymentIntentId: z.string() }).strict(),
    params: z.object({}),
    query: z.object({}),

})




export const payRequestSchema = z.object({

    body: z.object({ paymentIntentId: z.string() }).strict(),
    params: z.object({}),
    query: z.object({}),

})

export const getOrdersByBuyerIdRequestSchema = z.object({

    body: z.undefined(),
    params: z.object({
        
    }),
    query: z.object({}),

})