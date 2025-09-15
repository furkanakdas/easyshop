import { Microservices, verifyGatewayJwt } from '@faeasyshop/common';
import express, { Request, Response } from 'express';
import { config } from '../../config';
import { StatusCodes } from 'http-status-codes';
import { validateRequest } from '../middlewares/request-validation';




const router = express.Router()





// router.post("/cart/products",
//     verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.ORDER_SERVICE),
//     validateRequest(),
//     );




export { router }