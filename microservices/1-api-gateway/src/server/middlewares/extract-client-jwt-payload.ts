import { NextFunction, Request, Response } from "express";
import { config } from "../../config";
import jwt from 'jsonwebtoken';
import { ClientJwtPayload, CurrentUser,  NotAuthorizedError, verifyJwtRS256 } from "@faeasyshop/common";


declare global {
    namespace Express {
        interface Request {
            clientJwtPayload?: ClientJwtPayload;
        }
    }
}


export function extractClientJwtPayload(req: Request, res: Response, next: NextFunction) {


    if (!req.session?.jwt) {
        req.clientJwtPayload = undefined;
        next();
        return;
    }

    const jwt = req.session.jwt;

    try {

        req.clientJwtPayload = verifyJwtRS256<ClientJwtPayload>(
            jwt,
            Buffer.from(config.JWT_CLIENT_PUBLIC_TOKEN_BASE64, "base64").toString("utf-8"),
            {});

    } catch (err) {
        req.clientJwtPayload = undefined;
    }

    next();

}