import express from 'express';
import { Microservices } from '@faeasyshop/common';
import { attachGatewayToken } from '../middlewares/attach-gateway-token';
import { authProxy } from '../middlewares/proxies/auth.proxy';

import { extractClientJwtPayload } from '../middlewares/extract-client-jwt-payload';
import { authRequest } from '../middlewares/auth-request';
import { ensureGuest } from '../middlewares/ensure-guest';
import { cacheMiddleware } from '../middlewares/cache';


const router = express.Router()

//unprotected routes
router.all(`/verify-email`, extractClientJwtPayload, ensureGuest, attachGatewayToken(Microservices.AUTH_SERVICE), authProxy);
router.all(`/verify-otp`, extractClientJwtPayload, ensureGuest, attachGatewayToken(Microservices.AUTH_SERVICE), authProxy);

router.all(`/signin`, extractClientJwtPayload, ensureGuest, attachGatewayToken(Microservices.AUTH_SERVICE), authProxy);
router.all(`/signup`, extractClientJwtPayload, ensureGuest, attachGatewayToken(Microservices.AUTH_SERVICE), authProxy);
router.all(`/forgot-password`, extractClientJwtPayload, ensureGuest, attachGatewayToken(Microservices.AUTH_SERVICE), authProxy);
router.all(`/reset-password`, extractClientJwtPayload, ensureGuest, attachGatewayToken(Microservices.AUTH_SERVICE), authProxy);
router.all(`/health`, extractClientJwtPayload, attachGatewayToken(Microservices.AUTH_SERVICE), authProxy);

router.all(`/currentuser`,
    extractClientJwtPayload,
    attachGatewayToken(Microservices.AUTH_SERVICE),
    authProxy);


//protected routes
router.all(`/signout`, extractClientJwtPayload, authRequest, attachGatewayToken(Microservices.AUTH_SERVICE), authProxy);
router.all(`/change-password`, extractClientJwtPayload, authRequest, attachGatewayToken(Microservices.AUTH_SERVICE), authProxy);



// router.use(`/${Microservices.AUTH_SERVICE}`,attachGatewayToken(Microservices.AUTH_SERVICE),authProxy);



export { router as authRouter }

