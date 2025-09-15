import { config } from "../../config";
import cors from "cors"



export const corsMiddleware = cors({
    origin: config.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})