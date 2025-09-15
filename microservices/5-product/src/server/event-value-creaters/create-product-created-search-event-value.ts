import { ProductCreatedSearchEvent } from "@faeasyshop/common";
import { Product } from "../../orm/entity/product";
import { categoryRepository, productRepository } from "../../orm/repositories";
import { EntityManager } from "typeorm";

export async function createProductCreatedSearchEventValue(productId: string, manager: EntityManager) {


    const joinedProduct = await manager.findOne(Product,{
        where: { id: productId }
        , relations: ["category", "attributeValues.attributeDefinition", "tags"]
    }) as Product

    

    const parentsIdDesc = (await categoryRepository.getCategoryParentsAsc(joinedProduct.category)).reverse().map(c => c.id);
    const searchAttributes = joinedProduct.attributeValues.map(
        attrValue => {
            return {
                unit: attrValue.attributeDefinition.unit,
                value: attrValue.value,
                name: attrValue.attributeDefinition.name,
                attributeDefinitionId: attrValue.attributeDefinition.id
            }
        })

    const tags = joinedProduct.tags.map(tag => { return tag.id })


    return {
        id: joinedProduct.id,
        name: joinedProduct.name,
        description: joinedProduct.description,
        price: joinedProduct.price,
        currency: joinedProduct.currency,
        createdAt: joinedProduct.createdAt,
        updatedAt: joinedProduct.updatedAt,
        seller: {
            id: joinedProduct.sellerId
        },
        category: {
            id: joinedProduct.category.id,
            name: joinedProduct.category.name,
            categoryIdPath: [...parentsIdDesc]
        },
        attributes: [...searchAttributes],
        tagIds: [...tags],

    } satisfies ProductCreatedSearchEvent["value"]
}
