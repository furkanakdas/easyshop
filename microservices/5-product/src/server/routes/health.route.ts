import express from 'express';
import { healthController } from '../controllers/health.controller';


const router = express.Router()


router.get("/health",healthController);
router.get("/ready",healthController);



export { router as healthRouter}
