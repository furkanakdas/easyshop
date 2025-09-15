import express, { Request, Response } from 'express';
import { errorHandler, ErrorSchema, Microservices, NotFoundError } from '@faeasyshop/common';
import { healthRouter } from './routes/health.route';
import { config } from '../config';
import { router } from './routes/routes';
import { zodErrorHandler } from './middlewares/zod.error-handler';


const HTTP_SERVER_PORT = 4007;


const app = express();

//standart middlewares



app.use(express.json());

//routes
app.use("", healthRouter);


app.use("",router);




app.all('*splat', async (req: Request, res: Response) => {
    throw new NotFoundError({path:req.path});
});





//error handler
app.use(zodErrorHandler);
app.use(errorHandler);




export function startHttpServer() {

    const server = app.listen(HTTP_SERVER_PORT, () => {
        console.log(`http server listening on port ${HTTP_SERVER_PORT}`);
    })

    return server;

}

