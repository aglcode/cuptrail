import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getUser() {
   const clerkUser = await currentUser()
   if (!clerkUser) return null

   const user = await prisma.user.upsert({
      where: { id: clerkUser.id },
      update: {},
      create: {
       id: clerkUser.id,
       email: clerkUser.emailAddresses[0]?.emailAddress ?? null,
       name: clerkUser.fullName ?? null,
       image: clerkUser.imageUrl ?? null,
    },
  })
  return user
}