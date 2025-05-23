declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      permissions?: any
    }
  }

  interface User {
    role: string
    permissions?: any
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    permissions?: any
  }
}
