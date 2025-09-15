import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { BadRequestError, ForbiddenError, producerWrapper, Topics, UserRole } from "@faeasyshop/common";
import { productRepository, sellerProfileRepository } from "../../../orm/repositories";
import { stripe } from "../../../clients/stripe.client";
import { updateProductRequestSchema } from "../../schema/product.schema";
import { ProductCreatedSearchProducer } from "../../../kafka/producers/product-created-search.producer";
import { createProductCreatedSearchEventValue } from "../../event-value-creaters/create-product-created-search-event-value";
import { ProductCreatedProducer } from "../../../kafka/producers/product-created.producer";
import { createProductCreatedEventValue } from "../../event-value-creaters/create-product-created-event-value";
import { OutboxEvent } from "../../../orm/entity/outbox-event";
import { runInTransaction } from "../../helpers/runInTransaction";
// import { createProductBodySchema, updateProductBodySchema, updateProductParamsSchema } from "../schema/product.schema";
// import { ProductService } from "../services/product.service";


export async function updateProductController(req: Request, res: Response) {


    const request = updateProductRequestSchema.parse(req);
    const updateInput = request.body;
    const productId = request.params.id;



    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

    if (!currentUser) {
        throw new Error("this route should be protected");
    }

    if (currentUser.role != UserRole.SELLER) {
        throw new ForbiddenError({});
    }


    const previousProduct = await productRepository.findOne({
        where: { id: productId, sellerId: currentUser.id }
    });

    if (!previousProduct) {
        throw new BadRequestError({ message: "the book you want to  update does not exist" })
    }


    const sellerProfile = await sellerProfileRepository.findOne({ where: { userId: currentUser.id } });

    if (!sellerProfile) {
        throw new BadRequestError({ message: "seller profile for this user didnt found" })
    }


    await stripe.products.update(previousProduct.stripeProductId, {
        name: previousProduct.name,
        description: previousProduct.description,
    }, {
        stripeAccount: sellerProfile.stripeAccountId
    });


    let stripePriceId;

    if (previousProduct.price != updateInput.price || previousProduct.currency != updateInput.currency) {

        const newPrice = await stripe.prices.create({
            product: previousProduct.stripeProductId,
            unit_amount: updateInput.price * 100,
            currency: updateInput.currency,
        }, {
            stripeAccount: sellerProfile.stripeAccountId
        });

        stripePriceId = newPrice.id;

    } else {
        stripePriceId = previousProduct.stripePriceId;
    }

    const { attributes, ...createProductInput } = updateInput;




    const savedProduct = await runInTransaction(async manager => {


        let createdProduct = productRepository.create({
            id: productId,
            attributeValues: attributes,
            stripePriceId,
            ...createProductInput,

        });

        const savedProduct = await manager.save(createdProduct);


        const productCreatedSearchEventValue = await createProductCreatedSearchEventValue(savedProduct.id,manager)

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