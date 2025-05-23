import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

interface InitResult {
  success: boolean
  message: string
  admin?: {
    id: string
    email: string
    name: string
  }
}

export async function initializeAdmin(): Promise<InitResult> {
  try {
    // Проверяем, существует ли уже администратор
    const adminExists = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    })

    if (adminExists) {
      return {
        success: true,
        message: "Administrator already exists",
        admin: {
          id: adminExists.id,
          email: adminExists.email,
          name: adminExists.name,
        },
      }
    }

    // Проверяем наличие переменных окружения
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      return {
        success: false,
        message: "Missing ADMIN_EMAIL or ADMIN_PASSWORD environment variables",
      }
    }

    // Создаем администратора
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    const admin = await prisma.user.create({
      data: {
        name: "Administrator",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    return {
      success: true,
      message: "Administrator created successfully",
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    }
  } catch (error) {
    console.error("Failed to initialize admin:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
