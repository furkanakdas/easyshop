


import { UserRole } from "@faeasyshop/common";
import { z } from "zod";






export const createTagBodySchema = z.object({
    name: z.string().min(1),
    controlledBy:z.nativeEnum(UserRole)


}).strict();

export const createTagRequestSchema = z.object({

    body: createTagBodySchema,
    query: z.object({}).strict(),
    params: z.object({}).strict(),
})






