import express from 'express';
import { healthController } from '../controllers/health.controller';
import { validateRequest } from '../middlewares/request-validation';
import { updateBuyerProfileController } from '../controllers/buyer-profile/update-buyer-profile.controller';
import { updateBuyerProfileSchema } from '../schemas/update-buyer-profile.schema';
import { createAddressSchema } from '../schemas/create-address.schema';
import { createAddressController } from '../controllers/address/add-address.controller';
import { updateAddressSchema } from '../schemas/update-address.schema';
import { updateAddressController } from '../controllers/address/update-address.controller';
import { getBuyerProfileController } from '../controllers/buyer-profile/get-buyer-profile.controller';
import { getAddressSchema } from '../schemas/get-address.schema';
import { getAddressController } from '../controllers/address/get-address.controller';
import { getAddressesController } from '../controllers/address/get-addresses.controller';
import { createSellerProfileController } from '../controllers/seller-profile/create-seller-profile.controller';
import { createSellerSchema } from '../schemas/create-seller-profile.schema';
import { Microservices, verifyGatewayJwt } from '@faeasyshop/common';
import { config } from '../../config';
import { sellerProfileDashboardController } from '../controllers/seller-profile/seller-profile-dashboard.controller';
import { sellerProfileReauthController } from '../controllers/seller-profile/seller-profile-reauth.controller';
import { getSellerProfileController } from '../controllers/seller-profile/get-seller-profile.controller';




const router = express.Router()


router.put("/buyer-profile",verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN,Microservices.USERS_SERVICE),validateRequest(updateBuyerProfileSchema),updateBuyerProfileController);
router.get("/buyer-profile",verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN,Microservices.USERS_SERVICE),getBuyerProfileController);

router.post("/address",verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN,Microservices.USERS_SERVICE),validateRequest(createAddressSchema),createAddressController);
router.put("/address/:id",verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN,Microservices.USERS_SERVICE),validateRequest(updateAddressSchema),updateAddressController);
router.get("/address/:id",verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN,Microservices.USERS_SERVICE),validateRequest(getAddressSchema),getAddressController)
router.get("/address",verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN,Microservices.USERS_SERVICE),getAddressesController)

router.get("/seller-profile",verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN,Microservices.USERS_SERVICE),getSellerProfileController)
router.post("/seller-profile",verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN,Microservices.USERS_SERVICE),validateRequest(createSellerSchema),createSellerProfileController)

router.get("/seller-profile/reauth",verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN,Microservices.USERS_SERVICE),sellerProfileReauthController)
router.get("/seller-profile/dashboard",verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN,Microservices.USERS_SERVICE),sellerProfileDashboardController)



// router.get("/currentuser",verifyGatewayJwt,currentUserController);


export { router }