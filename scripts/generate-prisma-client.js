const { execSync } = require("child_process")
const path = require("path")
const fs = require("fs")

console.log("🔄 Generating Prisma Client...")

try {
  // Проверяем, существует ли директория .prisma/client
  const prismaClientDir = path.join(__dirname, "..", "node_modules", ".prisma", "client")

  if (!fs.existsSync(prismaClientDir)) {
    console.log("📁 Creating Prisma client directory...")
    fs.mkdirSync(prismaClientDir, { recursive: true })
  }

  // Генерируем Prisma клиент
  console.log("⚙️ Running prisma generate...")
  execSync("npx prisma generate", { stdio: "inherit" })

  console.log("✅ Prisma client generated successfully!")
} catch (error) {
  console.error("❌ Failed to generate Prisma client:", error)
  // Не завершаем процесс с ошибкой, чтобы сборка могла продолжиться
  console.log("⚠️ Continuing build despite Prisma generation error...")
}
