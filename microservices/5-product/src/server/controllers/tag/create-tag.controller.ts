import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';

import { BadRequestError, ForbiddenError, UserRole } from "@faeasyshop/common";
import { categoryRepository, tagRepository } from "../../../orm/repositories";
import { createTagBodySchema, createTagRequestSchema } from "../../schema/tag.schema";


export async function createTagController(req: Request, res: Response) {

    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

    if (!currentUser) {
        throw new Error("this route should be protected");
    }

    if (currentUser.role != UserRole.ADMIN) {
        throw new ForbiddenError({});
    }

    const body = createTagBodySchema.parse(req.body);


    const existing = await tagRepository.findOneBy({ name: body.name });
    if (existing) throw new BadRequestError({ message: "Tag name already exists" });

    const tag = tagRepository.create({ ...body });
    const savedCategory = await tagRepository.save(tag);

    res.status(StatusCodes.OK).json(savedCategory)
}