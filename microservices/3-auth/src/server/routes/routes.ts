import express from 'express';
import { healthController } from '../controllers/health.controller';
import { validateRequest } from '../middlewares/request-validation';
import { signupSchema } from '../schemas/signup.schema';
import { signupController } from '../controllers/signup.controller';
import { signinSchema } from '../schemas/signin.schema';
import { signinController } from '../controllers/signin.controller';
import { currentUserController } from '../controllers/current-user.controller';
import { verifyEmailController } from '../controllers/verify-email.controller';
import { forgotPasswordController } from '../controllers/forgot-password.controller';
import { resetPasswordController } from '../controllers/reset-password.controller';
import { forgotPasswordSchema } from '../schemas/forgot-pasword.schema';
import { resetPasswordSchema } from '../schemas/reset-password.schema';
import { changePasswordSchema } from '../schemas/change-password.schema';
import { changePasswordController } from '../controllers/change-password.controller';
import { Microservices, verifyGatewayJwt } from '@faeasyshop/common';
import { config } from '../../config';
import { signoutController } from '../controllers/signout.controller';
import { verifyOptSchema } from '../schemas/verify-opt.schema';
import { verifyOptController } from '../controllers/verify-opt.controller';


const router = express.Router()

router.get("/signout", verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.AUTH_SERVICE),  signoutController);

router.post("/signin", verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.AUTH_SERVICE), validateRequest(signinSchema), signinController);
router.post("/signup", verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.AUTH_SERVICE), validateRequest(signupSchema), signupController);
router.post("/forgot-password", verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.AUTH_SERVICE), validateRequest(forgotPasswordSchema), forgotPasswordController);
router.post("/reset-password", verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.AUTH_SERVICE), validateRequest(resetPasswordSchema), resetPasswordController);
router.post("/change-password", verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.AUTH_SERVICE), validateRequest(changePasswordSchema), changePasswordController);

router.get("/verify-otp",verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.AUTH_SERVICE), validateRequest(verifyOptSchema), verifyOptController)
router.get("/health",verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.AUTH_SERVICE),  healthController)

router.get("/currentuser", verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.AUTH_SERVICE), currentUserController);
router.get("/verify-email", verifyGatewayJwt(config.JWT_GATEWAY_PUBLIC_TOKEN, Microservices.AUTH_SERVICE), verifyEmailController);

export { router }