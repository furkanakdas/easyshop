import { z } from "zod";





export const addProductToCartRequestSchema = z.object({

    body: z.object({
        productId: z.string().uuid(),
        quantity: z.number().positive()
    }).strict(),
    params: z.object({}),
    query: z.object({}),

})



export const removeProductFromCartRequestSchema = z.object({

    body: z.object({ cartProductId: z.string().uuid(), }).strict(),
    params: z.object({}),
    query: z.object({}),

})


export const checkoutRequestSchema = z.object({

    body: z.object({ addressId: z.string().uuid(), }).strict(),
    params: z.object({}),
    query: z.object({}),

})


export const getCartRequestSchema = z.object({

    body: z.undefined(),
    params: z.object({}),
    query: z.object({}),

})







