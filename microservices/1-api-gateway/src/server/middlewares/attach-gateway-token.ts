import { Request, Response, NextFunction } from "express";
import {  CreateGatewayJwtPayload, createJwtRS256, GatewayJwtPayload, Microservices } from "@faeasyshop/common";
import { config } from "../../config";





export function attachGatewayToken(audience: string) {

    
    const attachGatewayToken = (req: Request, res: Response, next: NextFunction) => {
        
        let createGatewayJwtPayload:CreateGatewayJwtPayload = {clientJwtPayload:undefined};
       
        if(req.clientJwtPayload){
            createGatewayJwtPayload.clientJwtPayload = req.clientJwtPayload;
        }



        const gatewayJwt = createJwtRS256<CreateGatewayJwtPayload>(
            createGatewayJwtPayload
            , Buffer.from(config.JWT_GATEWAY_PRIVATE_TOKEN_BASE64,"base64").toString("utf-8"),
            { issuer: Microservices.API_GATEWAY_SERVICE, audience: audience });

        req.headers["authorization"] = `Bearer ${gatewayJwt}`;

        next();

    }

    return attachGatewayToken;

}

