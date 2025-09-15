


import { z } from "zod";
import { AttributeDefinitionTypes } from "../../orm/enums/attribute-definition-types.enum";



export const createAttributeDefinitionBodySchema = z.object({

        name: z.string(),
        type: z.nativeEnum(AttributeDefinitionTypes),
        required: z.boolean(),
        enumOptions: z.array(z.string()).optional(),
        unit: z.string().optional(),
        categoryId: z.string().uuid()
    

}).strict();


export const createAttributeDefinitionRequestSchema = z.object({

     body:createAttributeDefinitionBodySchema,
     params:z.object({}),
     query:z.object({}),

})






export type CreateAttributeDefinitionBody = z.infer<typeof createAttributeDefinitionBodySchema>;









