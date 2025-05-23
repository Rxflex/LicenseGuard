const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🔄 Checking Prisma client...")

// Проверяем, существует ли .prisma/client
const prismaClientPath = path.join(__dirname, "..", "node_modules", ".prisma", "client")

if (!fs.existsSync(prismaClientPath)) {
  console.log("❌ Prisma client not found, generating...")
  try {
    execSync("npx prisma generate", { stdio: "inherit" })
    console.log("✅ Prisma client generated successfully")
  } catch (error) {
    console.error("❌ Failed to generate Prisma client:", error.message)
    process.exit(1)
  }
} else {
  console.log("✅ Prisma client already exists")
}
