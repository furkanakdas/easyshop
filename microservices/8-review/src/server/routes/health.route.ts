import express from 'express';
import { healthController } from '../controller/health.controller';
import { readyController } from '../controller/ready.controller';



const router = express.Router()


router.get("/health",healthController);
router.get("/ready",readyController);


export { router as healthRouter}
