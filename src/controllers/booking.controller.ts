import { Request, Response } from "express";
import {
  getUpcomingBookingsForAllUsers,
  getTodayCheckIns,
  getTodayCheckOuts,
  updateBookingStatus,
} from "../services/booking.service.js";

// BigInt-safe serializer
const serializeBigInt = (data: any) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );

export const fetchUpcomingBookingsForAllUsers = async (
  req: Request,
  res: Response,
) => {
  try {
    const bookings = await getUpcomingBookingsForAllUsers();

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("FETCH BOOKINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const fetchTodayCheckIns = async (req: Request, res: Response) => {
  try {
    const checkins = await getTodayCheckIns();

    return res.status(200).json({
      success: true,
      count: checkins.length,
      data: serializeBigInt(checkins),
    });
  } catch (error) {
    console.error("FETCH TODAY CHECKINS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch today's check-ins",
    });
  }
};

export const fetchTodayCheckOuts = async (req: Request, res: Response) => {
  try {
    const checkouts = await getTodayCheckOuts();

    return res.status(200).json({
      success: true,
      count: checkouts.length,
      data: serializeBigInt(checkouts),
    });
  } catch (error) {
    console.error("FETCH TODAY CHECKOUTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch today's check-outs",
    });
  }
};

export const updateBookingStatusController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const updated = await updateBookingStatus(BigInt(id), status);

    return res.status(200).json({
      success: true,
      data: updated,
      message: "Status Updated Successfully",
    });
  } catch (error) {
    console.error("UPDATE BOOKING STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update booking status",
    });
  }
};
