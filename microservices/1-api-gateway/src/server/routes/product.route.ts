import express, { Router } from 'express';
import { Microservices } from '@faeasyshop/common';
import { attachGatewayToken } from '../middlewares/attach-gateway-token';

import { extractClientJwtPayload } from '../middlewares/extract-client-jwt-payload';
import { authRequest } from '../middlewares/auth-request';

import { productProxy } from '../middlewares/proxies/product.proxy';


const router = express.Router()


//protected routes

// router.post("/seller-profile",express.json(),extractClientJwtPayload, authRequest, attachGatewayToken(Microservices.USERS_SERVICE),createSellerProfileController)
router.all("/*splat",extractClientJwtPayload, authRequest, attachGatewayToken(Microservices.PRODUCT),productProxy)



// router.use(`/${Microservices.AUTH_SERVICE}`,attachGatewayToken(Microservices.AUTH_SERVICE),authProxy);



export { router as productRouter }

