import express, { Request, Response } from 'express';
import { errorHandler, NotFoundError } from '@faeasyshop/common';
import { healthRouter } from './routes/health.route';

const HTTP_SERVER_PORT = 4002;


const app = express();

app.use(express.json());

app.use("",healthRouter);



app.all('*splat', async (req:Request, res:Response) => {
    throw new NotFoundError({path:req.path});
});

app.use(errorHandler);


export function startHttpServer(){

    const server = app.listen(HTTP_SERVER_PORT,()=>{
        console.log(`http server listening on port ${HTTP_SERVER_PORT}`);
    })

    return server;

}

