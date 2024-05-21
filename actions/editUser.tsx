"use server";
import prisma from "@/app/lib/db";
import { io } from "socket.io-client";
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

    const socket = io("https://menurapideadmin.netlify.app");

    // Wait for the connection to establish before emitting (optional)
    await new Promise<void>((resolve) => {
      socket.on("connect", () => resolve());
    }); 

    // Emit the event
    socket.emit("notification", {
      title: "User Update",
      message: `User has changed his name to ${name}`,
    });  
  } catch (error) {
    console.error("Failed to edit user or emit event:", error);
    // Handle the error appropriately
  }
};
