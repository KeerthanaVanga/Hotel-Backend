import { Request, Response } from "express";
import { getAllCheckInOptions } from "../services/checkinOption.service.js";
import { serializeBigInt } from "../utils/serializeBigint.js";

export const fetchAllCheckInOptions = async (_req: Request, res: Response) => {
  try {
    const checkInOptions = await getAllCheckInOptions();

    return res.status(200).json({
      success: true,
      count: checkInOptions.length,
      data: serializeBigInt(checkInOptions),
    });
  } catch (error) {
    console.error("FETCH CHECK-IN OPTIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch check-in options",
    });
  }
};
