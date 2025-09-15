import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { prisma } from "../clients/database.client";

import { BadRequestError,  NotAuthorizedError, } from "@faeasyshop/common";
import { comparePasswords, hashPassword } from "../helpers/bcryptjs.password";

import { ChangePasswordBody } from "../schemas/change-password.schema";




export async function changePasswordController(req: Request<{}, {}, ChangePasswordBody>, res: Response) {

    const input = { ...req.body };

    if(!req.gatewayJwtPayload || !req.gatewayJwtPayload.clientJwtPayload){
        throw new NotAuthorizedError({});
    }


    const currentUser = req.gatewayJwtPayload.clientJwtPayload;

    const existingUser = await prisma.user.findUnique({
        where: {
            email: currentUser.email,
        },
    });


    if (!existingUser) {
        throw new NotAuthorizedError({});
    }

    const passwordsMatch =await comparePasswords(input.currentPassword,existingUser.passwordHash);
    
    if(!passwordsMatch){
        throw new BadRequestError({message:"Passwords dont match"});
    }

    const hashedNewPassword =await hashPassword(input.newPassword);

    const updatedUser = await prisma.user.update({ where: { email: existingUser.email }, data: { passwordHash: hashedNewPassword } });


    res.status(StatusCodes.OK).json({  })


}