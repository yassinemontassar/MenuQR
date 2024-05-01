"use server";
import prisma from "@/app/lib/db";
export const editUser = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
};
