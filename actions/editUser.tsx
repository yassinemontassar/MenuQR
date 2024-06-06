"use server";
import prisma from "@/app/lib/db";
import { emitNotification } from "@/utils/socket.service";
export const editUser = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

  try {
    // Update the user in the database
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    await emitNotification('User update', `User has changed his name to ${name}`);

  } catch (error) {
    console.error("Failed to edit user or emit event:", error);
    // Handle the error appropriately
  }
};
