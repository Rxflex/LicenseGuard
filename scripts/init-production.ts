import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

async function main() {
  const prisma = new PrismaClient()

  try {
    console.log("🔄 Initializing production database...")

    // Проверяем подключение к базе данных
    await prisma.$connect()
    console.log("✅ Database connection established")

    // Проверяем, существует ли уже администратор
    const adminExists = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    })

    if (!adminExists) {
      // Создаем администратора по умолчанию
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10)

      const admin = await prisma.user.create({
        data: {
          name: "Administrator",
          email: process.env.ADMIN_EMAIL || "admin@example.com",
          password: hashedPassword,
          role: "ADMIN",
        },
      })

      console.log("✅ Administrator created:")
      console.log(`   Email: ${admin.email}`)
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || "admin123"}`)
    } else {
      console.log("✅ Administrator already exists")
    }

    console.log("✅ Production database initialized successfully")
  } catch (error) {
    console.error("❌ Error initializing production database:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

export default main
