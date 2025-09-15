import { Microservices, verifyGatewayJwt } from '@faeasyshop/common';
import express, { Request, Response } from 'express';
import { config } from '../../config';
import { StatusCodes } from 'http-status-codes';
import { validateRequest } from '../middlewares/request-validation';
import { addProductToCartController } from '../controllers/cart/add-product-to-cart.controller';
import { addProductToCartRequestSchema, checkoutRequestSchema, getCartRequestSchema, removeProductFromCartRequestSchema } from '../schema/cart.schema';
import { removeProductFromCartController } from '../controllers/cart/remove-product-from-cart.controller';
import { getCartController } from '../controllers/cart/get-cart.controller';
import { checkoutController } from '../controllers/cart/checkout.controller';
import { payController } from '../controllers/order/pay.controller';
import { createPaymentIntentController } from '../controllers/order/create-payment-intent.controller';
import { getPaymentIntentController } from '../controllers/order/get-payment-intent-status.controller';
import { createPaymentIntentRequestSchema, getOrdersByBuyerIdRequestSchema, getPaymentIntentRequestSchema, payRequestSchema } from '../schema/order.schema';
import { getOrdersByBuyerIdController } from '../controllers/order/get-orders-by-buyer-ıd.controller';




const router = express.Router()





router.post("/cart/products",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.ORDER_SERVICE),
    validateRequest(addProductToCartRequestSchema),
    addProductToCartController);


router.get("/cart/products",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.ORDER_SERVICE),
    validateRequest(getCartRequestSchema),
    getCartController);



router.delete("/cart/products",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.ORDER_SERVICE),
    validateRequest(removeProductFromCartRequestSchema),
    removeProductFromCartController);



router.post("/cart/checkout",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.ORDER_SERVICE),
    validateRequest(checkoutRequestSchema),
    checkoutController);


router.post("/order/pay",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.ORDER_SERVICE),
    validateRequest(payRequestSchema),
    payController);



router.post("/order/create-payment-intent",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.ORDER_SERVICE),
    validateRequest(createPaymentIntentRequestSchema),
    createPaymentIntentController);



router.get("/order/get-payment-intent/:paymentIntentId",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.ORDER_SERVICE),
    validateRequest(getPaymentIntentRequestSchema),
    getPaymentIntentController);

router.get("/order/orders/:buyerId",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.ORDER_SERVICE),
    validateRequest(getOrdersByBuyerIdRequestSchema),
    getOrdersByBuyerIdController);



export { router }