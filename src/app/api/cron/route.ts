import prisma from "@/app/lib/db";

async function updateMenu() {
  try {
    const result = await prisma.menu.updateMany({
      data: {
        name: {
          set: "a", // Replace with your actual update logic
        },
      },
    });
    console.log('Menu updated successfully:', result);
  } catch (error) {
    console.error('Error updating menu:', error);
  }
}

updateMenu(); // Call the function immediately