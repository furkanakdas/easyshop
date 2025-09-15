import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';

import { BadRequestError, ForbiddenError, UserRole } from "@faeasyshop/common";
import { createCategoryBodySchema } from "../../schema/category.schema";
import { categoryRepository } from "../../../orm/repositories";
import { Category } from "../../../orm/entity/category";


export async function createCategoryController(req: Request, res: Response) {



    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

    if (!currentUser) {
        throw new Error("this route should be protected");
    }

    if (currentUser.role != UserRole.ADMIN) {
        throw new ForbiddenError({});
    }


    const createCategoryInput = createCategoryBodySchema.parse(req.body);

    let parentCategory: Category | null = null;

    if (createCategoryInput.parentId) {
        parentCategory = await categoryRepository.findOne({ where: { id: createCategoryInput.parentId } })

        if (!parentCategory) {
            throw new BadRequestError({ message: "parent category does not exist" })
        }
    }

    const category = categoryRepository.create({ ...createCategoryInput });


    const savedCategory = await categoryRepository.save(category);

    res.status(StatusCodes.OK).json(savedCategory)
}