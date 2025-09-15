import express, { Router } from 'express';
import { Microservices } from '@faeasyshop/common';
import { attachGatewayToken } from '../middlewares/attach-gateway-token';

import { extractClientJwtPayload } from '../middlewares/extract-client-jwt-payload';
import { authRequest } from '../middlewares/auth-request';

import { orderProxy } from '../middlewares/proxies/order.proxy';


const router = express.Router()



router.all("/*splat",extractClientJwtPayload, authRequest, attachGatewayToken(Microservices.ORDER_SERVICE),orderProxy)


export { router as orderRouter }

