import express from 'express';
import { healthController } from '../controllers/health.controller';
import { readyController } from '../controllers/ready.controller';


const router = express.Router()



router.get("/health",express.json(),healthController);
router.get("/ready",express.json(),readyController);




export { router as healthRouter}
