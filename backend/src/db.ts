import {PrismaClient} from '@prisma/client'

//Client prisma pour faire des requêtes BD
const prisma = new PrismaClient();
export default prisma;