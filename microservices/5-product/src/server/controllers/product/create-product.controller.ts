import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';

import { BadRequestError, ForbiddenError, producerWrapper, Topics, UserRole } from "@faeasyshop/common";
import { CreateProductBody } from "../../schema/product.schema";
import { stripe } from "../../../clients/stripe.client";
import { productRepository, sellerProfileRepository } from "../../../orm/repositories";
import { ProductCreatedSearchProducer } from "../../../kafka/producers/product-created-search.producer";
import { createProductCreatedSearchEventValue } from "../../event-value-creaters/create-product-created-search-event-value";
import { createProductCreatedEventValue } from "../../event-value-creaters/create-product-created-event-value";
import { ProductCreatedProducer } from "../../../kafka/producers/product-created.producer";
import { runInTransaction } from "../../helpers/runInTransaction";
import { OutboxEvent } from "../../../orm/entity/outbox-event";


export async function createProductController(req: Request<{}, any, CreateProductBody, {}>, res: Response) {


  const createProductBody = req.body;

  const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

  if (!currentUser) {
    throw new Error("this route should be protected");
  }

  if (currentUser.role != UserRole.SELLER) {
    throw new ForbiddenError({});
  }


  const { attributes, ...createProductInput } = createProductBody;
  const sellerProfile = await sellerProfileRepository.findOne({ where: { userId: currentUser.id } });

  if (!sellerProfile) {
    throw new BadRequestError({ message: "seller profile for this user didnt found" })
  }

  const stripeProduct = await stripe.products.create({
    name: createProductInput.name,
    description: createProductInput.description,
  }, {
    stripeAccount: sellerProfile.stripeAccountId
  });


  const stripePrice = await stripe.prices.create({
    product: stripeProduct.id,
    unit_amount: createProductInput.price * 100,
    currency: createProductInput.currency,
  }, {
    stripeAccount: sellerProfile.stripeAccountId
  });



  const savedProduct = await runInTransaction(async manager => {


    const createdProduct = productRepository.create({
      sellerId: currentUser.id,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
      attributeValues: attributes,
      inventory: {},
      ...createProductInput,
    });



    const savedProduct = await productRepository.save(createdProduct);
    const productCreatedSearchEventValue = await createProductCreatedSearchEventValue(savedProduct.id,manager);


    
    const productCreatedSearchOutboxEvent = manager.create(OutboxEvent, {
      aggregateId: savedProduct.id,
      eventType: Topics.PRODUCT_CREATED_SEARCH,
      payload: productCreatedSearchEventValue,
    })

    await manager.save(productCreatedSearchOutboxEvent)

    const productCreatedEventValue = await createProductCreatedEventValue(savedProduct.id,manager);

    const productCreatedOutboxEvent = manager.create(OutboxEvent, {
      aggregateId: savedProduct.id,
      eventType: Topics.PRODUCT_CREATED,
      payload: productCreatedEventValue,
    })

    await manager.save(productCreatedOutboxEvent)


    return savedProduct

  })







  res.status(StatusCodes.OK).json({ product: savedProduct })


}