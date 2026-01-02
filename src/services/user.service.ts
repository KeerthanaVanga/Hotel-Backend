import { prisma } from "../lib/prisma";

export const getAllUsers = async () => {
  return await prisma.users.findMany({
    select: {
      user_id: true,
      name: true,
      email: true,
      whatsapp_number: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
};
