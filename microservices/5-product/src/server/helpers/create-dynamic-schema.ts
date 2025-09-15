import { z, ZodTypeAny } from "zod";
import { AttributeDefinition } from "../../orm/entity/attribute-definition";
import { AttributeDefinitionTypes } from "../../orm/enums/attribute-definition-types.enum";
import { createProductBodySchema } from "../schema/product.schema";
import { BadRequestError } from "@faeasyshop/common";




export function createDynamicSchema(attrDefs: AttributeDefinition[]) {

    const attributeSchemas: z.ZodTypeAny[] = [];

    attrDefs.forEach(attrDef => {

        let valueSchema: z.ZodTypeAny;
        let definitionIdSchema: z.ZodTypeAny;


        switch (attrDef.type) {
            case AttributeDefinitionTypes.STRING:
                valueSchema = z.string();
                break;
            case AttributeDefinitionTypes.NUMBER:
                valueSchema = z.number();
                break;
            case AttributeDefinitionTypes.BOOLEAN:
                valueSchema = z.boolean();
                break;
            case AttributeDefinitionTypes.DATE:

                valueSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
                    message: `${attrDef.name} geçerli bir tarih olmali`
                });
                break;
            case AttributeDefinitionTypes.ENUM:
                if (!attrDef.enumOptions || attrDef.enumOptions.length == 0) {
                    throw new Error(`Enum attribute '${attrDef.name}' için enumOptions tanimlanmali`);
                }
                valueSchema = z.enum([...attrDef.enumOptions] as [string, ...string[]]);
                break;

            default:
                throw new BadRequestError({ message: `Bilinmeyen attribute type: ${attrDef.type}` })

        }

        valueSchema = attrDef.required ? valueSchema : valueSchema.optional();

        definitionIdSchema = z.literal(attrDef.id);

        const schema = z.object({
            attributeDefinitionId: definitionIdSchema, // sadece bu id’yi kabul eder
            value: valueSchema
        });


        attributeSchemas.push(schema);

    })

    let attrSchema: z.ZodTypeAny;

    if (attributeSchemas.length == 0) {
        attrSchema = z.array(z.never({ message: "Bu kategori için herhangi bir attribute tanimlanmadi" }));
    }
    else if (attributeSchemas.length == 1) {
        attrSchema = z.tuple([attributeSchemas[0]], { message: "Bu kategori için sadece bir attribute tanimlandi" });;
    } else {
        attrSchema = z.array(z.union(attributeSchemas as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]])).refine((arr) => {
            const requiredIds = attrDefs.filter((a) => a.required).map((a) => a.id);
            const presentIds = arr.map((a) => a.attributeDefinitionId);

            return requiredIds.every((id) => presentIds.includes(id)) && requiredIds.length == presentIds.length;
        }, {
            message: "Bazi zorunlu öznitelikler eksik ya da fazla"
        })
    }

    let dynamicSchema = createProductBodySchema.extend({ attributes: attrSchema });

    return dynamicSchema;
}