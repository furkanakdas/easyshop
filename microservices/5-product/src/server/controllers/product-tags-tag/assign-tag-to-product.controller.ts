import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { findProductByIdRequestSchema } from "../../schema/product.schema";
import { assignTagToProductRequestSchema } from "../../schema/product-tags-tag";
import { productRepository, tagRepository } from "../../../orm/repositories";
import { BadRequestError, ForbiddenError, producerWrapper, Topics, UserRole } from "@faeasyshop/common";
import { ProductCreatedSearchProducer } from "../../../kafka/producers/product-created-search.producer";
import { createProductCreatedSearchEventValue } from "../../event-value-creaters/create-product-created-search-event-value";
import { ProductCreatedProducer } from "../../../kafka/producers/product-created.producer";
import { createProductCreatedEventValue } from "../../event-value-creaters/create-product-created-event-value";
import { OutboxEvent } from "../../../orm/entity/outbox-event";
import { runInTransaction } from "../../helpers/runInTransaction";


export async function assignTagToProductController(req: Request, res: Response) {


  const request = assignTagToProductRequestSchema.parse(req);
  const productId = request.params.id;
  const tagId = request.body.tagId;

  const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

  if (!currentUser) {
    throw new Error("this route should be protected");
  }

  if (currentUser.role != UserRole.SELLER) {
    throw new ForbiddenError({});
  }

  const product = await productRepository.findOne({
    where: { id: productId, sellerId: currentUser.id },
    relations: ["tags"]
  });

  if (!product) throw new BadRequestError({ message: "product does not exist" });


  const tag = await tagRepository.findOne({ where: { id: tagId } });

  if (!tag) {
    throw new BadRequestError({ message: "send tag does not exist" })
  }

  if (currentUser.role != tag.controlledBy) {
    throw new ForbiddenError({ message: "send tag cant be assigned by you" })
  }




  await runInTransaction(async manager => {

    product.tags.push(tag)

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