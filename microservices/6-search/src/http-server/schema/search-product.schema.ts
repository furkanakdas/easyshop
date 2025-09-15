import { z } from "zod";






export const searchProductQuerySchema = z.object({


    q:z.string().optional(),
    categoryName:z.string().optional(),
    sellerId:z.string().uuid().optional(),
    minPrice:z.coerce.number().nonnegative().optional(),
    maxPrice:z.coerce.number().nonnegative().optional(),
    tagIds:z.string().optional(),
    sortBy:z.enum(["price","createdAt"]).optional(),
    sortOrder:z.enum(["desc","asc"]).optional(),
    page:z.coerce.number().nonnegative().optional(),
    limit:z.coerce.number().nonnegative().optional(),

}).catchall(z.string());;

export const searchProductRequestSchema = z.object({

    body: z.undefined(),
    query: searchProductQuerySchema,
    params: z.object({}).strict(),
})




