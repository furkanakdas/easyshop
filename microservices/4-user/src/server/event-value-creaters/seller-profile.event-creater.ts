import { BadRequestError, CompanyType, SellerProfileStatus } from "@faeasyshop/common";
import { $Enums, Prisma, SellerProfile } from "@prisma/client";
import { prisma } from "../clients/database.client";





export async function createSellerProfileEventValue(tx: Prisma.TransactionClient | undefined, sellerProfileId: string) {


    let createdSellerProfile;
    if (tx) {
        createdSellerProfile = await tx.sellerProfile.findUnique({ where: { userId: sellerProfileId } })

    } else {
        createdSellerProfile = await prisma.sellerProfile.findUnique({ where: { userId: sellerProfileId } })
    }



    if (!createdSellerProfile) {
        throw new BadRequestError({ message: "Seller profile does not exist" })
    }

    let companyType: CompanyType;

    if (createdSellerProfile.companyType == $Enums.CompanyType.SOLE_PROPRIETORSHIP) {
        companyType = CompanyType.SOLE_PROPRIETORSHIP;
    } else {
        companyType = CompanyType.SOLE_PROPRIETORSHIP;
    }


    let status: SellerProfileStatus;

    if (createdSellerProfile.status == $Enums.SellerProfileStatus.PENDING) {
        status = SellerProfileStatus.PENDING;
    } else {
        status = SellerProfileStatus.APPROVED;
    }


    return {
        userId: createdSellerProfile.userId,
        email: createdSellerProfile.email,
        phone: createdSellerProfile.phone,
        identityNumber: createdSellerProfile.identityNumber,
        businessName: createdSellerProfile.businessName,
        businessDescription: createdSellerProfile.businessDescription,
        companyType: companyType,
        stripeAccountId: createdSellerProfile.stripeAccountId,
        iban: createdSellerProfile.iban,
        taxId: createdSellerProfile.taxId,
        createdAt: createdSellerProfile.createdAt,
        status: status
    }

}