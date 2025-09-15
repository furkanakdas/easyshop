import express from 'express';
import { healthController } from '../controllers/health.controller';
import { readyController } from '../controllers/ready.controller';


const router = express.Router()


router.get("/health",healthController);
router.get("/ready",readyController);



export { router as healthRouter}
