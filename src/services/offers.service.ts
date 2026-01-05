// server/services/offers.service.ts
import { prisma } from "../lib/prisma.js";

/** Get all offers */
export const getAllOffers = async () => {
  return prisma.room_offers.findMany({
    orderBy: { created_at: "desc" },
    include: {
      rooms: {
        select: {
          room_id: true,
          room_name: true,
          room_type: true,
          price: true,
        },
      },
    },
  });
};

/** Get single offer */
export const getOfferById = async (offerId: number) => {
  return prisma.room_offers.findUnique({
    where: { offer_id: offerId },
    include: {
      rooms: {
        select: {
          room_id: true,
          room_name: true,
          room_type: true,
          price: true,
        },
      },
    },
  });
};

/** Create offer (room_name → room_id mapping happens in controller) */
export const createOffer = async (data: {
  title:string;
  room_id: number;
  discount_percent: number;
  start_date?: Date | null;
  end_date?: Date | null;
  is_active?: boolean;
}) => {
  return prisma.room_offers.create({
    data,
  });
};

/** Update offer */
export const updateOffer = async (
  offerId: number,
  data: Partial<{
    room_id: number;
    discount_percent: number;
    start_date: Date | null;
    end_date: Date | null;
    is_active: boolean;
    title:string;
  }>
) => {
  return prisma.room_offers.update({
    where: { offer_id: offerId },
    data,
  });
};

/** Delete offer */
export const deleteOffer = async (offerId: number) => {
  return prisma.room_offers.delete({
    where: { offer_id: offerId },
  });
};
