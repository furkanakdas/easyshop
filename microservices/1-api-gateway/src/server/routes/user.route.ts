import express, { Router } from 'express';
import { Microservices } from '@faeasyshop/common';
import { attachGatewayToken } from '../middlewares/attach-gateway-token';

import { extractClientJwtPayload } from '../middlewares/extract-client-jwt-payload';
import { authRequest } from '../middlewares/auth-request';
import { userProxyMiddleware } from '../middlewares/proxies/user.proxy';
import { cacheMiddleware } from '../middlewares/cache';


const router = express.Router()


//protected routes

// router.post("/seller-profile",express.json(),extractClientJwtPayload, authRequest, attachGatewayToken(Microservices.USERS_SERVICE),createSellerProfileController)

router.get("/buyer-profile",
    extractClientJwtPayload,
    authRequest,
    attachGatewayToken(Microservices.USERS_SERVICE),
    cacheMiddleware("user", true, 300),
    userProxyMiddleware)


router.get("/seller-profile",
    extractClientJwtPayload,
    authRequest,
    attachGatewayToken(Microservices.USERS_SERVICE),
    cacheMiddleware("user", true, 300),
    userProxyMiddleware)

router.all("/*splat",
    extractClientJwtPayload,
    authRequest,
    attachGatewayToken(Microservices.USERS_SERVICE),
    userProxyMiddleware)



// router.use(`/${Microservices.AUTH_SERVICE}`,attachGatewayToken(Microservices.AUTH_SERVICE),authProxy);



export { router as userRouter }

