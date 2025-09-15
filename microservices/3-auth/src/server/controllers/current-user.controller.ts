import { Request, Response } from "express";

import {StatusCodes} from 'http-status-codes';

import { BadRequestError, ClientJwtPayload, GatewayJwtPayload, NotAuthorizedError, RequestValidationError, verifyJwtRS256 } from "@faeasyshop/common";


export async function currentUserController(req:Request,res:Response){


    if(!req.gatewayJwtPayload?.clientJwtPayload){
        throw new NotAuthorizedError({});
    }

    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;
    
    res.status(StatusCodes.OK).json(currentUser);
    
}