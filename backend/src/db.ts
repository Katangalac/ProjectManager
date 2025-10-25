import {PrismaClient} from '@prisma/client'

//Création du Client prisma "db" pour faire des requêtes vers la BD

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const db =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ["query", "error", "warn"], 
    });


if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
}

