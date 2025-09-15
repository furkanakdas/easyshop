import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';

import { ForgotPasswordBody } from "../schemas/forgot-pasword.schema";
import { ResetPasswordBody } from "../schemas/reset-password.schema";
import { prisma } from "../clients/database.client";
import { BadRequestError } from "@faeasyshop/common";
import { hashPassword } from "../helpers/bcryptjs.password";



export async function resetPasswordController(req: Request<{}, {}, ResetPasswordBody>, res: Response) {

    const input = { ...req.body };

    const user = await prisma.user.findFirst({
        where: {
          resetPasswordToken: input.token,
          resetPasswordExpiresAt: { gt: new Date() }
        }
    });

    if(!user){
        throw new BadRequestError({message:"Password reset token is either invalid or expired"});
    }

    const hashedPassword =await hashPassword(input.password);

    const updatedUser = await prisma.user.update({
        where: {
            email: user.email,
        },
        data: {
            passwordHash: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpiresAt: null
        },
    });



    res.status(StatusCodes.OK).json({ })



}