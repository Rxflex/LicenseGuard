const fs = require("fs")
const path = require("path")

// Путь к директории, где должен быть Prisma клиент
const prismaClientDir = path.join(__dirname, "..", "node_modules", ".prisma", "client")
const defaultClientPath = path.join(__dirname, "..", "node_modules", "@prisma", "client", "default.js")

// Создаем минимальный клиент, если его нет
function createMinimalClient() {
  console.log("Creating minimal Prisma client...")

  // Создаем директории, если их нет
  if (!fs.existsSync(prismaClientDir)) {
    fs.mkdirSync(prismaClientDir, { recursive: true })
  }

  const defaultClientDir = path.dirname(defaultClientPath)
  if (!fs.existsSync(defaultClientDir)) {
    fs.mkdirSync(defaultClientDir, { recursive: true })
  }

  // Создаем минимальный клиент
  const minimalClient = `
// Минимальный Prisma клиент для предотвращения ошибок сборки
const { PrismaClient } = require('@prisma/client/runtime');
module.exports = {
  PrismaClient: PrismaClient
};
  `

  fs.writeFileSync(defaultClientPath, minimalClient)
  console.log("Minimal Prisma client created at:", defaultClientPath)
}

// Проверяем, существует ли Prisma клиент
if (!fs.existsSync(defaultClientPath)) {
  console.log("Prisma client not found, creating minimal version...")
  createMinimalClient()
} else {
  console.log("Prisma client found at:", defaultClientPath)
}
