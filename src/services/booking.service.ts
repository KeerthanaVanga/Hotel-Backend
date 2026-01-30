import { prisma } from "../lib/prisma.js";

export const getUpcomingBookingsForAllUsers = async () => {
  // 1️⃣ Fetch all users
  const users = await prisma.users.findMany({
    select: {
      user_id: true,
    },
  });

  if (!users.length) {
    return [];
  }

  // 2️⃣ Extract user IDs
  const userIds = users.map((user) => user.user_id);

  // 3️⃣ Calculate start of today in IST → UTC
  const now = new Date();

  const startOfTodayIST = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );

  // IST offset = +5:30
  const startOfTodayUTC = new Date(
    startOfTodayIST.getTime() - 5.5 * 60 * 60 * 1000,
  );

  // 4️⃣ Fetch bookings
  return prisma.bookings.findMany({
    where: {
      user_id: {
        in: userIds,
      },
      check_in: {
        gte: startOfTodayUTC,
      },
    },
    orderBy: {
      check_in: "asc",
    },
    include: {
      users: {
        select: {
          user_id: true,
          name: true,
          email: true,
        },
      },
      rooms: {
        select: {
          room_id: true,
          room_name: true,
          room_type: true,
          room_number: true,
          price: true,
        },
      },
    },
  });
};

export const getTodayCheckIns = async () => {
  // Get today's date in YYYY-MM-DD (Asia/Kolkata safe)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return prisma.bookings.findMany({
    where: {
      check_in: {
        gte: today,
        lt: tomorrow,
      },
      status: {
        not: "cancelled",
      },
    },
    include: {
      users: {
        select: {
          user_id: true,
          name: true,
        },
      },
      rooms: {
        select: {
          room_id: true,
          room_name: true,
        },
      },
    },
    orderBy: {
      check_in: "asc",
    },
  });
};

export const getTodayCheckOuts = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return prisma.bookings.findMany({
    where: {
      OR: [
        // Today's check-outs
        {
          check_out: {
            gte: today,
            lt: tomorrow,
          },
        },
        // Overstayed
        {
          check_out: {
            lt: today,
          },
          status: {
            not: "checked out",
          },
        },
      ],
      status: {
        not: "cancelled",
      },
    },
    include: {
      users: {
        select: {
          name: true,
        },
      },
      rooms: {
        select: {
          room_name: true,
        },
      },
    },
    orderBy: {
      check_out: "asc",
    },
  });
};

export const updateBookingStatus = async (
  bookingId: bigint,
  status: string,
) => {
  return prisma.bookings.update({
    where: {
      booking_id: bookingId,
    },
    data: {
      status,
    },
  });
};
