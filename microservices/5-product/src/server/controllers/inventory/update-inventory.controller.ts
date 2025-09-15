import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';

import { BadRequestError, ForbiddenError, producerWrapper, Topics, UserRole } from "@faeasyshop/common";
import { stripe } from "../../../clients/stripe.client";
import { inventoryRepository, outboxEventRepository, productAttributeValueRepository, productRepository } from "../../../orm/repositories";
import { updateInventoryRequestSchema } from "../../schema/inventory.schema";
import { ProductCreatedProducer } from "../../../kafka/producers/product-created.producer";
import { createProductCreatedEventValue } from "../../event-value-creaters/create-product-created-event-value";
import { runInTransaction } from "../../helpers/runInTransaction";
import { Inventory } from "../../../orm/entity/inventory";
import { OutboxEvent } from "../../../orm/entity/outbox-event";

export async function updateInventoryController(req: Request, res: Response) {

  const request = updateInventoryRequestSchema.parse(req);
  const updateInventoryBody = request.body;
  const productId = request.params.id;
  const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

  if (!currentUser) {
    throw new Error("this route should be protected");
  }

  if (currentUser.role != UserRole.SELLER) {
    throw new ForbiddenError({});
  }

  const product = await productRepository.findOne({
    where: { id: productId, sellerId: currentUser.id },
    relations: ["inventory"]
  })

  if (!product) {
    throw new BadRequestError({ message: "product does not exist" })
  }


  const savedInventory = await runInTransaction(async (manager) => {

    const createdInventory = manager.create(Inventory, {
      id: product.inventory.id,
      productId: product.id,
      ...updateInventoryBody,
    });

    const savedInventory = await manager.save(createdInventory);

    const eventPayload = await createProductCreatedEventValue(product.id,manager);

    eventPayload.inventory = {
      id: savedInventory.id,
      quantity: savedInventory.quantity
    }

    const createdOutboxEvent =  manager.create(OutboxEvent, {
      aggregateId: eventPayload.id,
      eventType: Topics.PRODUCT_CREATED,
      payload: eventPayload,
    })

    await manager.save(createdOutboxEvent);


    return savedInventory

  });


  // const productCreatedProducer = new ProductCreatedProducer(producerWrapper.producer);
  // const productCreatedEventValue = await createProductCreatedEventValue(product.id);
  // await productCreatedProducer.send(productCreatedEventValue);

  res.status(StatusCodes.OK).json(savedInventory)


}