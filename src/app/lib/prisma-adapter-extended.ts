declare module "@next-auth/prisma-adapter" {
    interface AdapterUser {
      plan?: string;
    }
  }