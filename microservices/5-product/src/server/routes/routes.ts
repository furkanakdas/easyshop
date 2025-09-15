import { Microservices, verifyGatewayJwt } from '@faeasyshop/common';
import express, { Request, Response } from 'express';
import { config } from '../../config';
import { StatusCodes } from 'http-status-codes';
import { Product } from '../../orm/entity/product';
import { Currency } from '../../orm/enums/currency.enum';
import { createProductController } from '../controllers/product/create-product.controller';
import { updateProductController } from '../controllers/product/update-product.controller';
import { getProductByIdController } from '../controllers/product/get-product-by-id.controller';
import { createCategoryController } from '../controllers/category/create-category.controller';
import { createAttributeDefinitionController } from '../controllers/attribute-definition/create-attribute-definition.controller';
import { validateRequest } from '../middlewares/request-validation';
import { createProductRequestSchema, findProductByIdRequestSchema, updateProductRequestSchema } from '../schema/product.schema';
import { validateProductAttributes } from '../middlewares/validate-product-attributes';
import { updateInventoryRequestSchema } from '../schema/inventory.schema';
import { updateInventoryController } from '../controllers/inventory/update-inventory.controller';
import { createTagRequestSchema } from '../schema/tag.schema';
import { createTagController } from '../controllers/tag/create-tag.controller';
import { assignTagToProductController } from '../controllers/product-tags-tag/assign-tag-to-product.controller';
import { assignTagToProductRequestSchema, removeTagFromProductBodySchema, removeTagFromProductRequestSchema } from '../schema/product-tags-tag';
import { removeTagFromProductController } from '../controllers/product-tags-tag/remove-tag-from-product.controller';
import { createCategoryRequestSchema } from '../schema/category.schema';
import { createAttributeDefinitionRequestSchema } from '../schema/attribute-definition.schema';




const router = express.Router()





router.get("/product/:id",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.PRODUCT),
    validateRequest(findProductByIdRequestSchema),
    getProductByIdController);

router.post("/product",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.PRODUCT),
    validateRequest(createProductRequestSchema),
    validateProductAttributes,
    createProductController
);

router.put("/product/:id",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.PRODUCT),
    validateRequest(updateProductRequestSchema),
    validateProductAttributes,
    updateProductController
);

router.put("/product/:id/inventory",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.PRODUCT),
    validateRequest(updateInventoryRequestSchema),
    updateInventoryController
)

router.post("/category",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.PRODUCT),
    validateRequest(createCategoryRequestSchema),

    createCategoryController);


router.post("/attribute-definition",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.PRODUCT),
    validateRequest(createAttributeDefinitionRequestSchema),
    createAttributeDefinitionController);


router.post("/tag",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.PRODUCT),
    validateRequest(createTagRequestSchema),
    createTagController
)

router.post("/product/:id/tag/assign",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.PRODUCT),
    validateRequest(assignTagToProductRequestSchema),
    assignTagToProductController
)


router.post("/product/:id/tag/remove",
    verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.PRODUCT),
    validateRequest(removeTagFromProductRequestSchema),
    removeTagFromProductController
)

export { router }