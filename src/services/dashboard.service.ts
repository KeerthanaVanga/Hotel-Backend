import { prisma } from "../lib/prisma.js";
import { startOfDay, endOfDay } from "date-fns";

/** Format helpers */
const formatHour = (d: Date) =>
  d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

export const getDashboardSummary = async () => {
  const now = new Date();
  const fromDate = startOfDay(now);
  const toDate = endOfDay(now);

  // Total users
  const totalUsers = await prisma.users.count();

  // Newly added users (today)
  const newUsersToday = await prisma.users.count({
    where: { created_at: { gte: fromDate, lte: toDate } },
  });

  // Today bookings (created today)
  const todayBookings = await prisma.bookings.count({
    where: { created_at: { gte: fromDate, lte: toDate } },
  });

  // Today check-in (check_in is today)
  const todayCheckIn = await prisma.bookings.count({
    where: { check_in: { gte: fromDate, lte: toDate } },
  });

  // Today checkout (check_out is today)
  const todayCheckOut = await prisma.bookings.count({
    where: { check_out: { gte: fromDate, lte: toDate } },
  });

  // Upcoming bookings count (check_in after today)
  const upcomingBookings = await prisma.bookings.count({
    where: {
      check_in: { gt: toDate },
      // optional: ignore cancelled
      NOT: { status: "cancelled" },
    },
  });

  // Today revenue (sum of bill_paid_amount)
  const todayRevenueAgg = await prisma.payments.aggregate({
    _sum: { bill_paid_amount: true },
    where: { created_at: { gte: fromDate, lte: toDate } },
  });

  const todayRevenue = Number(todayRevenueAgg._sum.bill_paid_amount || 0);

  // Pie chart: today bookings status breakdown (confirmed/rescheduled/cancelled etc.)
  const statusGroups = await prisma.bookings.groupBy({
    by: ["status"],
    _count: { status: true },
    where: { created_at: { gte: fromDate, lte: toDate } },
  });

  const bookingStatus = statusGroups.map((g) => ({
    status: String(g.status),
    count: g._count.status,
  }));

  // Graph: hourly bookings today (created_at grouped by hour)
  // Postgres:
  const hourly = await prisma.$queryRaw<{ hour: Date; count: number }[]>`
    SELECT date_trunc('hour', created_at) as hour,
           COUNT(*)::int as count
    FROM bookings
    WHERE created_at BETWEEN ${fromDate} AND ${toDate}
    GROUP BY date_trunc('hour', created_at)
    ORDER BY date_trunc('hour', created_at)
  `;

  const hourlyBookings = hourly.map((h) => ({
    hour: formatHour(h.hour),
    count: Number(h.count),
  }));

  return {
    kpis: {
      totalUsers,
      newUsersToday,
      todayBookings,
      todayCheckIn,
      todayCheckOut,
      upcomingBookings,
      todayRevenue,
    },
    charts: {
      bookingStatus,
      hourlyBookings,
    },
  };
};
