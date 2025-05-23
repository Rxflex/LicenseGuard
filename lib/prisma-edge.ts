import { PrismaClient } from "@prisma/client"

declare global {
  var __prisma: PrismaClient | undefined
}

// Создаем единственный экземпляр Prisma клиента
export const prisma = globalThis.__prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma
}
