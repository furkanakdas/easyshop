import express, { Router } from 'express';
import { Microservices } from '@faeasyshop/common';
import { attachGatewayToken } from '../middlewares/attach-gateway-token';
import { extractClientJwtPayload } from '../middlewares/extract-client-jwt-payload';
import { authRequest } from '../middlewares/auth-request';
import { reviewProxy } from '../middlewares/proxies/review.proxy';


const router = express.Router()


router.all("/*splat",extractClientJwtPayload, authRequest, attachGatewayToken(Microservices.REVIEW_SERVİCE),reviewProxy)



export { router as reviewRouter }

