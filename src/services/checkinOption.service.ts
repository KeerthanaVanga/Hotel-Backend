import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";

export type CheckInOptionRecord = Record<string, unknown>;

const FIND_ALL_CHECKIN_OPTIONS_QUERY = Prisma.sql`
  SELECT *
  FROM checkin_options
`;

export const getAllCheckInOptions = async (): Promise<
  CheckInOptionRecord[]
> => {
  return prisma.$queryRaw<CheckInOptionRecord[]>(
    FIND_ALL_CHECKIN_OPTIONS_QUERY,
  );
};
