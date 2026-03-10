import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";

const roomUnitDetailsSelect = {
  id: true,
  room_number: true,
  status: true,
  room_id: true,
  created_at: true,
  updated_at: true,
  rooms: {
    select: {
      room_id: true,
      room_name: true,
      room_type: true,
      price: true,
      total_rooms: true,
      rooms_available: true,
      booked_rooms: true,
      guests: true,
    },
  },
} satisfies Prisma.room_unitsSelect;

export type RoomUnitDetails = Prisma.room_unitsGetPayload<{
  select: typeof roomUnitDetailsSelect;
}>;

export const getAllRoomUnits = async (): Promise<RoomUnitDetails[]> => {
  return prisma.room_units.findMany({
    select: roomUnitDetailsSelect,
    orderBy: [{ room_number: "asc" }, { id: "asc" }],
  });
};
