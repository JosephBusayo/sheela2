import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * Ensures the current Clerk user exists in the Prisma database.
 * Returns the user record from the database.
 * Call this in API routes or page logic after authentication.
 */
export async function getOrCreateUser() {
  // Get the current Clerk user (server-side)
  const user = await currentUser();
  if (!user) throw new Error("No authenticated Clerk user found.");

  // Upsert the user to keep data fresh
  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      avatar: user.imageUrl || null,
      phone: user.phoneNumbers[0]?.phoneNumber || null,
    },
    create: {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      avatar: user.imageUrl || null,
      phone: user.phoneNumbers[0]?.phoneNumber || null,
    },
  });

  return dbUser;
}
