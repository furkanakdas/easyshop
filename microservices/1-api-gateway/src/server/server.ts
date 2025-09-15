import express, { Request, Response } from 'express';
import { adminWrapper, errorHandler, Microservices, NodeEnv, NotFoundError } from '@faeasyshop/common';
import { healthRouter } from './routes/health.route';
import compression from "compression"
import helmet from "helmet";
import hpp from "hpp";
import https from 'https';
import http from 'https';
import { cookieSessionMiddleware } from './middlewares/cookie-session';
import { corsMiddleware } from './middlewares/cors';
import { rateLimiterMiddleware } from './middlewares/rate-limiter';
import { authRouter } from './routes/auth.route';
import { userRouter } from './routes/user.route';
import { productRouter } from './routes/product.route';
import { searchRouter } from './routes/search.route';
import { orderRouter } from './routes/order.route';
import { reviewRouter } from './routes/review.route';
import fs from 'fs';


const SERVER_PORT = 4001;


const app = express();


app.use(corsMiddleware);

//standart middlewares
// app.use(express.json());

app.use(compression());

app.use(rateLimiterMiddleware)


//security middlewares
app.set("trust proxy", 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"]
    }
  }
}));

app.use(hpp());


//cookie session middleware
app.use(cookieSessionMiddleware)

//routes
app.use("", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/search", searchRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);





app.all('*splat', async (req: Request, res: Response) => {
    throw new NotFoundError({ path: req.path });
});



//error handler
app.use(errorHandler);


export  function startHttpServer() {

    const server =  app.listen(SERVER_PORT, () => {
        console.log(`http server listening on port ${SERVER_PORT}`);
    });

    return server;
}


// export function startHttpsServer() {

//     const key = fs.readFileSync('/certs/api.local-key.pem');
//     const cert = fs.readFileSync('/certs/api.local.pem');

//     const server = https.createServer({ key, cert }, app).listen(SERVER_PORT, () => {
//         console.log(`https server listening on port ${SERVER_PORT}`);
//     });


//     return server;
// }


