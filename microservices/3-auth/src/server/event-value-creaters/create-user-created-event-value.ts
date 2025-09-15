import { UserCreatedEvent, UserRole } from "@faeasyshop/common";
import { Prisma, User } from "@prisma/client";


export async function createUserCreatedEventValue(user: User) {

    let role: UserRole
    if (user.role == "BUYER") {
        role = UserRole.BUYER
    } else if (user.role == "SELLER") {
        role = UserRole.SELLER
    } else if (user.role == "ADMIN") {
        role = UserRole.ADMIN
    } else {
        role = UserRole.SYSTEM
    }
   

    return {
        
        id: user.id,
        email: user.email,
        role: role,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    
    } satisfies UserCreatedEvent["value"]
}
