import { UserPlan } from "@prisma/client";
import { UserRole } from "@prisma/client";
import { User } from "@prisma/client";
import 'next/auth/jwt'
type UserPlan = string 
declare module 'next-auth/jwt' {
    interface JWT {
        id: UserId
        plan: UserPlan
        role: UserRole
    }
}

declare module 'next-auth' {
    interface Session{
        user: User & {
            id: UserId
            plan: UserPlan
            role: UserRole
        }
    }
}