import { Request, Response } from "express";
import { getAllReviews } from "../services/review.service.js";
import { serializeBigInt } from "../utils/serializeBigint.js";

export const fetchAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await getAllReviews();

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: serializeBigInt(reviews),
    });
  } catch (error) {
    console.error("FETCH REVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};
