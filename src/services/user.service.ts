import { prisma } from "../lib/prisma.js";

export const getAllUsers = async () => {
  const users = await prisma.users.findMany({
    orderBy: {
      created_at: "desc", // latest users on top
    },
    select: {
      user_id: true,
      name: true,
      email: true,
      whatsapp_number: true,
      created_at: true,

      bookings: {
        take: 1, // latest booking
        orderBy: {
          created_at: "desc",
        },
        select: {
          check_in: true,
          check_out: true,

          payments: {
            take: 1, // latest payment
            orderBy: {
              created_at: "desc",
            },
            select: {
              status: true,
            },
          },
        },
      },
    },
  });

  // 🔥 Flatten the response
  return users.map((user) => ({
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    whatsapp_number: user.whatsapp_number,
    created_at: user.created_at,

    check_in: user.bookings[0]?.check_in || null,
    check_out: user.bookings[0]?.check_out || null,
    payment_status: user.bookings[0]?.payments[0]?.status || null,
  }));
};
export const createUser = async (data: {
  name: string;
  email: string;
  whatsapp: string;
}) => {
  return prisma.users.create({
    data: {
      name: data.name,
      email: data.email,
      whatsapp_number: data.whatsapp,
    },
  });
};

export const updateUser = async (
  userId: number,
  data: {
    name: string;
    email: string;
    whatsapp: string;
  },
) => {
  return prisma.users.update({
    where: { user_id: userId },
    data: {
      name: data.name,
      email: data.email,
      whatsapp_number: data.whatsapp,
    },
  });
};
