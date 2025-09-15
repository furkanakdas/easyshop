import { NextFunction, Request, Response } from "express";
import { config } from "../../config";
import jwt from 'jsonwebtoken';
import { ClientJwtPayload, GatewayJwtPayload, NotAuthorizedError, verifyJwtRS256 } from "@faeasyshop/common";




export function authRequest(req: Request, res: Response, next: NextFunction) {

    if (!req.clientJwtPayload) {
        throw new NotAuthorizedError({});
    }

    next();

}