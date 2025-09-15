import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { findProductByIdRequestSchema } from "../../schema/product.schema";
import { assignTagToProductRequestSchema, removeTagFromProductRequestSchema } from "../../schema/product-tags-tag";
import { productRepository, tagRepository } from "../../../orm/repositories";
import { BadRequestError, ForbiddenError, producerWrapper, Topics, UserRole } from "@faeasyshop/common";
import { ProductCreatedSearchProducer } from "../../../kafka/producers/product-created-search.producer";
import { createProductCreatedSearchEventValue } from "../../event-value-creaters/create-product-created-search-event-value";
import { ProductCreatedProducer } from "../../../kafka/producers/product-created.producer";
import { createProductCreatedEventValue } from "../../event-value-creaters/create-product-created-event-value";
import { runInTransaction } from "../../helpers/runInTransaction";
import { OutboxEvent } from "../../../orm/entity/outbox-event";


export async function removeTagFromProductController(req: Request, res: Response) {


    const request = removeTagFromProductRequestSchema.parse(req);
    const productId = request.params.id;
    const tagId = request.body.tagId;

    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

    if (!currentUser) {
        throw new Error("this route should be protected");
    }

    if (currentUser.role == UserRole.BUYER) {
        throw new ForbiddenError({});
    }

    const product = await productRepository.findOne({
        where: { id: productId, sellerId: currentUser.id },
        relations: ["tags"]
    });


    if (!product) throw new BadRequestError({ message: "product does not exist" });



    const tag = await tagRepository.findOne({ where: { id: tagId } });

    if (!tag) {
        throw new BadRequestError({ message: "Any of your send tag does not exist" })
    }

    if (currentUser.role != tag.controlledBy) {
        throw new ForbiddenError({ message: "Any of your send tag cant be removed by you" })
    }

    product.tags = product.tags.filter(t => t.id !== tag.id);



    await runInTransaction(async manager => {

        await manager.save(product)


        const productCreatedSearchEventValue = await createProductCreatedSearchEventValue(product.id,manager)

        const productCreatedSearchOutboxEvent = manager.create(OutboxEvent, {
            aggregateId: product.id,
            eventType: Topics.PRODUCT_CREATED_SEARCH,
            payload: productCreatedSearchEventValue,
        })

        await manager.save(productCreatedSearchOutboxEvent)

        const productCreatedEventValue = await createProductCreatedEventValue(product.id,manager);

        const productCreatedOutboxEvent = manager.create(OutboxEvent, {
            aggregateId: product.id,
            eventType: Topics.PRODUCT_CREATED,
            payload: productCreatedEventValue,
        })

        await manager.save(productCreatedOutboxEvent)


    })









    res.status(StatusCodes.OK).json()
}