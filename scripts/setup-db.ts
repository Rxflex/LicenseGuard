import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"

async function main() {
  const prisma = new PrismaClient()

  try {
    // Проверяем, существует ли уже администратор
    const adminExists = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    })

    if (!adminExists) {
      // Создаем администратора по умолчанию
      const hashedPassword = await bcrypt.hash("admin123", 10)

      const admin = await prisma.user.create({
        data: {
          id: randomUUID(),
          name: "Administrator",
          email: "admin@example.com",
          password: hashedPassword,
          role: "ADMIN",
        },
      })

      console.log("✅ Администратор создан:")
      console.log(`   Email: ${admin.email}`)
      console.log(`   Password: admin123`)
      console.log("\n⚠️ ВАЖНО: Смените пароль после первого входа!")
    } else {
      console.log("✅ Администратор уже существует")
    }

    console.log("\n✅ База данных успешно инициализирована")
  } catch (error) {
    console.error("❌ Ошибка при инициализации базы данных:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
