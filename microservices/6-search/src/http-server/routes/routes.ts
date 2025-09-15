import { Microservices, verifyGatewayJwt } from '@faeasyshop/common';
import express, { Request, Response } from 'express';
import { config } from '../../config';
import { StatusCodes } from 'http-status-codes';

import { validateRequest } from '../middlewares/request-validation';
import { searchProductController } from '../controllers/search-product.controller';
import { searchProductRequestSchema } from '../schema/search-product.schema';




const router = express.Router()



router.get(
    "/product",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.SEARCH_SERVICE),
    validateRequest(searchProductRequestSchema),
    searchProductController);
    
export { router }