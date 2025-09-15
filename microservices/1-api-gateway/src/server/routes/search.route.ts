import express, { Router } from 'express';
import { Microservices } from '@faeasyshop/common';
import { attachGatewayToken } from '../middlewares/attach-gateway-token';
import { extractClientJwtPayload } from '../middlewares/extract-client-jwt-payload';
import { authRequest } from '../middlewares/auth-request';
import { searchProxyMiddleware } from '../middlewares/proxies/search.proxy';
import { cacheMiddleware } from '../middlewares/cache';


const router = express.Router()

router.get("/product",
    extractClientJwtPayload,
    authRequest,
    attachGatewayToken(Microservices.SEARCH_SERVICE),
    cacheMiddleware("product", false),
    searchProxyMiddleware)

router.all("/*splat", extractClientJwtPayload, authRequest, attachGatewayToken(Microservices.SEARCH_SERVICE), searchProxyMiddleware)



export { router as searchRouter }

