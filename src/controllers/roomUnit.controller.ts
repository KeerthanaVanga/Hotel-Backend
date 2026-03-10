import { Request, Response } from "express";
import { getAllRoomUnits } from "../services/roomUnit.service";
import { serializeBigInt } from "../utils/serializeBigint.js";

export const fetchAllRoomUnits = async (_req: Request, res: Response) => {
  try {
    const roomUnits = await getAllRoomUnits();

    return res.status(200).json({
      success: true,
      count: roomUnits.length,
      data: serializeBigInt(roomUnits),
    });
  } catch (error) {
    console.error("FETCH ROOM UNITS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch room units",
    });
  }
};
