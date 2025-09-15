import { NextFunction, Request, Response } from "express";
import { config } from "../../config";
import jwt from 'jsonwebtoken';
import { BadRequestError, ClientJwtPayload, GatewayJwtPayload, NotAuthorizedError, verifyJwtRS256 } from "@faeasyshop/common";

export function ensureGuest(req: Request, res: Response, next: NextFunction) {


    console.log(req.clientJwtPayload);
    
    if (req.clientJwtPayload) {
        throw new BadRequestError({message:"this route only allowes for guests"});
    }

    next();

}