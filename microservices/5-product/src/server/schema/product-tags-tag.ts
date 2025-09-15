import { z } from "zod";


export const assignTagToProductBodySchema = z.object({


    tagId: z.string().uuid(),
    

}).strict();


export const assignTagToProductRequestSchema = z.object({

    body:assignTagToProductBodySchema,
    params:z.object({id:z.string().uuid()}),
    query:z.object({}).strict()
})





export const removeTagFromProductBodySchema = z.object({


    tagId: z.string().uuid(),

}).strict();


export const removeTagFromProductRequestSchema = z.object({

    body:removeTagFromProductBodySchema,
    params:z.object({id:z.string().uuid()}),
    query:z.object({}).strict()
})



