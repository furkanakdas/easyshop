import { BadRequestError, BuyerProfileCreatedEvent } from "@faeasyshop/common";
import { BuyerProfile, Prisma } from "@prisma/client";
import { prisma } from "../clients/database.client";




export async function createBuyerProfileEventValue(tx: Prisma.TransactionClient,buyerProfileId:string){


    const buyerProfile = await tx.buyerProfile.findUnique({where:{userId:buyerProfileId},include:{addresses:true}});

    if(!buyerProfile){
        throw new BadRequestError({message:"Buyer Profile does not exist"})
    }


    const addresses = buyerProfile.addresses satisfies BuyerProfileCreatedEvent["value"]["addresses"]

    return {
        userId: buyerProfile.userId,
        firstName: buyerProfile.firstName,
        lastName: buyerProfile.lastName,
        addresses: addresses
    } satisfies BuyerProfileCreatedEvent["value"]

}

