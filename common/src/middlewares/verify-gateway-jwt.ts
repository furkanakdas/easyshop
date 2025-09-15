import { NextFunction, Request, Response } from "express";
import { GatewayJwtPayload } from "../interfaces/gateway-jwt-payload";
import { NotAuthorizedError } from "../errors/not-authorized.error";
import { verifyJwtRS256 } from "../helpers/verify-jwt";
import { Microservices } from "../microservices.enum";

declare global {
    namespace Express {
        interface Request {
            gatewayJwtPayload?: GatewayJwtPayload;
        }
    }
}

export function verifyGatewayJwt(publicToken: string, audience: Microservices) {


    return (req: Request, res: Response, next: NextFunction) => {

        if (!req.headers["authorization"]) {
            throw new NotAuthorizedError({});
        }


        const gatewayJwt = req.headers["authorization"].split(" ")[1];

        if (!gatewayJwt) {
            throw new NotAuthorizedError({});
        }


        try {
            const gatewayJwtPayload = verifyJwtRS256<GatewayJwtPayload>(
                gatewayJwt,
                publicToken,
                { issuer: Microservices.API_GATEWAY_SERVICE, audience });

            req.gatewayJwtPayload = gatewayJwtPayload;


        } catch (err) {
            throw new NotAuthorizedError({});
        }

        next();

    }

}


export function verGatewayJwt(req: Request, res: Response, next: NextFunction) {





}