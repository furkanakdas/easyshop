import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { findProductByIdRequestSchema } from "../../schema/product.schema";
import {  productRepository } from "../../../orm/repositories";
import { NotFoundError } from "@faeasyshop/common";


export async function getProductByIdController(req: Request, res: Response) {


    const request = findProductByIdRequestSchema.parse(req);

    let product


    if (request.query.detail) {
        product = await productRepository.findOne({ where: { id: request.params.id }, relations: ["attributeValues", "attributeValues.attributeDefinition"] });;
    } else {
        product = await productRepository.findOne({ where: { id: request.params.id } });;
    }

    if (!product) {
        throw new NotFoundError({ message: "no product found for this id" });
    }
    res.status(StatusCodes.OK).json(product)
}