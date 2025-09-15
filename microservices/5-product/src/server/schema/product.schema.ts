


import { UserRole } from "@faeasyshop/common";
import { z } from "zod";
import { Currency } from "../../orm/enums/currency.enum";




export const productAttributeValueSchema = z.object({ attributeDefinitionId: z.string().uuid(), value: z.any() })


export const createProductBodySchema = z.object({



    name: z.string(),
    description: z.string().optional(),
    price: z.number().nonnegative()
        .refine((val) => {
            // 2 ondalık basamak kontrolü
            const [intPart, decimalPart] = val.toString().split(".");
            const totalDigits = (intPart + (decimalPart ?? "")).length;

            const isValidScale = !decimalPart || decimalPart.length <= 2;
            const isValidPrecision = totalDigits <= 10;

            return isValidScale && isValidPrecision;
        }, {
            message: "Price must have at most 10 digits in total and 2 digits after the decimal point",
        }),

    currency: z.nativeEnum(Currency),
    categoryId: z.string().uuid(),
    attributes: z.array(productAttributeValueSchema),


}).strict();



export const updateProductBodySchema = createProductBodySchema.extend({


    attributes: z.array(productAttributeValueSchema.extend({
        id:z.string().uuid()
    })),


}).strict();

export const createProductRequestSchema = z.object({

    body: createProductBodySchema,
    query: z.object({}).strict(),
    params: z.object({}).strict(),
})



export const updateProductRequestSchema = z.object({

    body: updateProductBodySchema,
    query: z.object({}).strict(),
    params: z.object({id:z.string()}).strict(),
})

export const findProductByIdRequestSchema = z.object({

    params:z.object({id:z.string().uuid()}).strict(),
    query:z.object({detail:z.string().optional()})

})




export type CreateProductBody = z.infer<typeof createProductBodySchema>;





