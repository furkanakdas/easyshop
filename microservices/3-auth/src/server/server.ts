import express, { Request, Response } from 'express';
import { errorHandler, ErrorSchema, Microservices, NotFoundError } from '@faeasyshop/common';
import { healthRouter } from './routes/health.route';
import { config } from '../config';
import { router } from './routes/routes';
import { cookieSessionMiddleware } from './middlewares/cookie-session';
import useragent from 'express-useragent';

const HTTP_SERVER_PORT = 4003;


const app = express();

//standart middlewares
app.use(express.json());

app.set("trust proxy", 1);

app.use(cookieSessionMiddleware)
app.use(useragent.express());

//routes
app.use("", healthRouter);


app.use("",router);




app.all('*splat', async (req: Request, res: Response) => {
    throw new NotFoundError({path:req.path});
});





//error handler
app.use(errorHandler);




export function startHttpServer() {

    const server = app.listen(HTTP_SERVER_PORT, () => {
        console.log(`http server listening on port ${HTTP_SERVER_PORT}`);
    })

    return server;

}

