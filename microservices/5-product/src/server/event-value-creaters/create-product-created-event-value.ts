import { ProductCreatedEvent, ProductCreatedSearchEvent } from "@faeasyshop/common";
import { Product } from "../../orm/entity/product";
import { categoryRepository, productRepository } from "../../orm/repositories";
import { EntityManager } from "typeorm";

export async function createProductCreatedEventValue(productId: string, manager: EntityManager) {




    const joinedProduct = await manager.findOne(Product,{
        where: { id: productId }
        , relations: ["category", "attributeValues.attributeDefinition", "tags","inventory"]
    }) as Product
    

    const searchAttributes = joinedProduct.attributeValues.map(
        attrValue => {
            return {
                unit: attrValue.attributeDefinition.unit,
                value: attrValue.value,
                name: attrValue.attributeDefinition.name,
                attributeDefinitionId: attrValue.attributeDefinition.id,
            }
        })

    const tagIds = joinedProduct.tags.map(tag => { return tag.id })


    return {
        id: joinedProduct.id,
        name: joinedProduct.name,
        description: joinedProduct.description,
        price: joinedProduct.price,
        currency: joinedProduct.currency,
        stripePriceId:joinedProduct.stripePriceId,
        stripeProductId:joinedProduct.stripeProductId,
        createdAt: joinedProduct.createdAt,
        updatedAt: joinedProduct.updatedAt,
        sellerId: joinedProduct.sellerId,
        categoryId: joinedProduct.category.id,
        attributes: [...searchAttributes],
        tagsIds: [...tagIds],
        inventory: {
            id: joinedProduct.inventory.id,
            quantity: joinedProduct.inventory.quantity,
        }
    } satisfies ProductCreatedEvent["value"]
}
