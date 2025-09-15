import { PrismaClient } from '@prisma/client'


export const prisma = new PrismaClient();


export async function checkDbConnection(){

    try {
        await prisma.$queryRaw`SELECT 1`; 
        return true
    } catch (error) {
        return false;
    }
}