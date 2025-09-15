import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';

import { BadRequestError, ForbiddenError, UserRole } from "@faeasyshop/common";
import { createCategoryBodySchema } from "../../schema/category.schema";
import { attributeDefinitionRepository, categoryRepository } from "../../../orm/repositories";
import { Category } from "../../../orm/entity/category";
import { createAttributeDefinitionBodySchema } from "../../schema/attribute-definition.schema";


export async function createAttributeDefinitionController(req: Request, res: Response) {

    
    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

    if (!currentUser) {
        throw new Error("this route should be protected");
    }

    if (currentUser.role != UserRole.ADMIN) {
        throw new ForbiddenError({});
    }


    const createAttributeDefinitionsBody = createAttributeDefinitionBodySchema.parse(req.body);
    

    const category = await categoryRepository.findOne({
        where:{id:createAttributeDefinitionsBody.categoryId}
    });

    if(!category){
        throw new BadRequestError({message:"No category found for this attribute definition"});
    }

    const createdAttrDef =  attributeDefinitionRepository.create({...createAttributeDefinitionsBody});

    const savedAttrDef = await attributeDefinitionRepository.save(createdAttrDef);
       
    res.status(StatusCodes.OK).json(savedAttrDef)
}