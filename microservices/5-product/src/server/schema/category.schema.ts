


import { UserRole } from "@faeasyshop/common";
import { z } from "zod";



export const createCategoryBodySchema = z.object({


     name:z.string(),
     parentId:z.string().uuid().optional()   
     

}).strict();


export const createCategoryRequestSchema = z.object({

     body:createCategoryBodySchema,
     params:z.object({}),
     query:z.object({}),

})





export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;









