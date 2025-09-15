import { Request, Response, NextFunction } from 'express';

import { BadRequestError } from '@faeasyshop/common';
import { attributeDefinitionRepository, categoryRepository } from '../../orm/repositories';
import { createDynamicSchema } from '../helpers/create-dynamic-schema';
import { createProductBodySchema } from '../schema/product.schema';
import { In } from 'typeorm';

export async function validateProductAttributes(req: Request, res: Response, next: NextFunction) {

  const createProductBody = createProductBodySchema.parse(req.body);

  let category = await categoryRepository.findOne({ where: { id: createProductBody.categoryId }, relations: ["parent"] });

  if (!category) {
    throw new BadRequestError({ message: "There is no category for this product" });
  }


  const categories = await categoryRepository.getCategoryParentsAsc(category);

  const categoryIds: string[] = [];

  categories.forEach(category => {
    categoryIds.push(category.id)
  })


  const attrDefs = await attributeDefinitionRepository.find({
    where: {
      category: {
        id: In(categoryIds),
      },
    },
  });


  let dynamicSchema = createDynamicSchema(attrDefs);

  dynamicSchema.parse(req.body);
  
  next();

}


