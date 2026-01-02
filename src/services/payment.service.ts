import { prisma } from "../lib/prisma";

export const getAllUsersPayments = async () => {
  return prisma.payments.findMany({
    orderBy: {
      created_at: "desc",
    },
    include: {
      users: {
        select: {
          user_id: true,
          name: true,
          email: true,
        },
      },
      bookings: {
        select: {
          booking_id: true,
          check_in: true,
          check_out: true,
          status: true,
        },
      },
    },
  });
};
